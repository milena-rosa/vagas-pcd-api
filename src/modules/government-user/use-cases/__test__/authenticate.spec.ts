import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { prisma } from '@/libs/__mocks__/prisma'
import { GovernmentUsersRepository } from '@/repositories/government-users-repository'
import { PrismaGovernmentUsersRepository } from '@/repositories/prisma/prisma-government-users-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthenticateGovernmentUserUseCase } from '../authenticate'

let usersRepository: UsersRepository
let governmentUsersRepository: GovernmentUsersRepository
let sut: AuthenticateGovernmentUserUseCase

vi.mock('@/libs/prisma')

describe('authenticate government user use case', () => {
  beforeEach(() => {
    usersRepository = new PrismaUsersRepository()
    governmentUsersRepository = new PrismaGovernmentUsersRepository()
    sut = new AuthenticateGovernmentUserUseCase(
      usersRepository,
      governmentUsersRepository,
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

    const mockGovernmentUser = {
      user_id: mockUser.user_id,
      user: mockUser,
    }

    prisma.user.findUnique.mockResolvedValueOnce(mockUser)
    prisma.governmentUser.findUnique.mockResolvedValueOnce(mockGovernmentUser)

    const { governmentUser } = await sut.execute({
      email: mockUser.email,
      password: '123456',
    })

    expect(governmentUser.user_id).toStrictEqual(mockGovernmentUser.user_id)
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
