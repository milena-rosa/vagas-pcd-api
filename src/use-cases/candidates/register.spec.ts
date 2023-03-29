import { prisma } from '@/libs/__mocks__/prisma'
import {
  CandidateUser,
  CandidatesRepository,
} from '@/repositories/candidates-repository'
import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { compare, hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EmailAlreadyRegisteredError } from '../errors/email-already-registered-error'
import { RegisterCandidateUseCase } from './register'

let candidatesRepository: CandidatesRepository
let usersRepository: UsersRepository
let sut: RegisterCandidateUseCase

vi.mock('@/libs/prisma')

describe('register candidate use case', () => {
  beforeEach(() => {
    candidatesRepository = new PrismaCandidatesRepository()
    usersRepository = new PrismaUsersRepository()
    sut = new RegisterCandidateUseCase(usersRepository, candidatesRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to register a candidate', async () => {
    const mockUser: User = {
      user_id: randomUUID(),
      email: 'janedoe@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCandidate: CandidateUser = {
      id: randomUUID(),
      name: 'Jane Doe',
      phone: null,
      resume: 'https://linkedin.com/in/milena-rosa',
      user_id: mockUser.user_id,
      user: mockUser,
    }

    prisma.candidate.create.mockResolvedValueOnce(mockCandidate)

    const { candidate } = await sut.execute({
      email: mockUser.email,
      name: mockCandidate.name,
      password: '123456',
      phone: mockCandidate.phone,
      resume: mockCandidate.resume,
    })

    expect(candidate).toStrictEqual(mockCandidate)
  })

  it('should hash candidate password on registry', async () => {
    const mockUser: User = {
      user_id: randomUUID(),
      email: 'janedoe@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCandidate: CandidateUser = {
      id: randomUUID(),
      name: 'Jane Doe',
      phone: null,
      resume: 'https://linkedin.com/in/milena-rosa',
      user_id: mockUser.user_id,
      user: mockUser,
    }

    prisma.candidate.create.mockResolvedValueOnce(mockCandidate)

    const { candidate } = await sut.execute({
      email: mockUser.email,
      name: mockCandidate.name,
      password: '123456',
      phone: mockCandidate.phone,
      resume: mockCandidate.resume,
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      candidate.user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with an email twice', async () => {
    const mockUser: User = {
      user_id: randomUUID(),
      email: 'janedoe@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCandidate: CandidateUser = {
      id: randomUUID(),
      name: 'Jane Doe',
      phone: null,
      resume: 'https://linkedin.com/in/milena-rosa',
      user_id: mockUser.user_id,
      user: mockUser,
    }

    prisma.user.findUnique.mockResolvedValueOnce(mockUser)

    await expect(() =>
      sut.execute({
        email: mockCandidate.user.email,
        name: mockCandidate.name,
        password: '123456',
        phone: mockCandidate.phone,
        resume: mockCandidate.resume,
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyRegisteredError)
  })
})
