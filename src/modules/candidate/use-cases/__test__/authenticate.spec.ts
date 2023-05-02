import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { prisma } from '@/libs/__mocks__/prisma'
import { CandidatesRepository } from '@/repositories/candidates-repository'
import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthenticateCandidateUseCase } from '../authenticate'

let usersRepository: UsersRepository
let candidatesRepository: CandidatesRepository
let sut: AuthenticateCandidateUseCase

vi.mock('@/libs/prisma')

describe('authenticate candidate use case', () => {
  beforeEach(() => {
    usersRepository = new PrismaUsersRepository()
    candidatesRepository = new PrismaCandidatesRepository()
    sut = new AuthenticateCandidateUseCase(
      usersRepository,
      candidatesRepository,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to authenticate an user', async () => {
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
      phone: '(77) 939014245',
      zipCode: '45007-605',
      street: 'Rua Padre Gilberto Vaz Sampaio',
      number: '933',
      complement: '',
      neighborhood: 'Lagoa das Flores',
      city: 'Vitória da Conquista',
      state: 'BA',
      linkedin: 'https://linkedin.com/in/jane-doe',
      professionalExperience: '',
      educationalBackground: '',
      skills: '',
      user: mockUser,
    }

    prisma.user.findUnique.mockResolvedValueOnce(mockUser)
    prisma.candidate.findUnique.mockResolvedValueOnce(mockCandidate)

    const { candidate } = await sut.execute({
      email: mockUser.email,
      password: '123456',
    })

    expect(candidate.candidate_id).toStrictEqual(mockCandidate.candidate_id)
  })

  it('should not be able to authenticate with a wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'janedoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with a wrong password', async () => {
    const mockUser: User = {
      user_id: randomUUID(),
      email: 'janedoe@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    prisma.user.findUnique.mockResolvedValueOnce(mockUser)

    await expect(() =>
      sut.execute({
        email: mockUser.email,
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
