import { prisma } from '@/libs/__mocks__/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { AuthenticateUserUseCase } from './authenticate'

let usersRepository: UsersRepository
let sut: AuthenticateUserUseCase

vi.mock('@/libs/prisma')

describe('authenticate user use case', () => {
  beforeEach(() => {
    usersRepository = new PrismaUsersRepository()
    sut = new AuthenticateUserUseCase(usersRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to authenticate an user', async () => {
    const mockUser: User = {
      id: '123',
      email: 'janedoe@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    prisma.user.findUnique.mockResolvedValueOnce(mockUser)

    const { user } = await sut.execute({
      email: mockUser.email,
      password: '123456',
    })

    expect(user).toStrictEqual(mockUser)
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
      id: '123',
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
