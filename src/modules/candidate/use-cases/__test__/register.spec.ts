import { EmailAlreadyRegisteredError } from '@/errors/email-already-registered-error'
import { prisma } from '@/libs/__mocks__/prisma'
import { CandidatesRepository } from '@/repositories/candidates-repository'
import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { compare, hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RegisterCandidateUseCase } from '../register'

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
    const mockUser = {
      user_id: randomUUID(),
      email: 'janedoe@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCandidate = {
      candidate_id: mockUser.user_id,
      name: 'Jane Doe',
      phone: null,
      resume: 'https://linkedin.com/in/jane-doe',
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

    expect(candidate).toStrictEqual({
      candidate_id: mockCandidate.candidate_id,
      name: mockCandidate.name,
      phone: mockCandidate.phone,
      resume: mockCandidate.resume,
      email: mockCandidate.user.email,
      created_at: mockCandidate.user.created_at,
      password_hash: mockCandidate.user.password_hash,
    })
  })

  it('should hash candidate password on registry', async () => {
    const mockUser = {
      user_id: randomUUID(),
      email: 'janedoe@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCandidate = {
      candidate_id: mockUser.user_id,
      name: 'Jane Doe',
      phone: null,
      resume: 'https://linkedin.com/in/jane-doe',
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
      candidate.password_hash,
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

    const mockCandidate = {
      candidate_id: mockUser.user_id,
      name: 'Jane Doe',
      phone: null,
      resume: 'https://linkedin.com/in/jane-doe',
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
