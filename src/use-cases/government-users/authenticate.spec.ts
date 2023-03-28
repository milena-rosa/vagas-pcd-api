import { prisma } from '@/libs/__mocks__/prisma'
import { GovernmentUsersRepository } from '@/repositories/government-users-repository'
import { PrismaGovernmentUsersRepository } from '@/repositories/prisma/prisma-government-users-repository'
import { GovernmentUser } from '@prisma/client'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { AuthenticateGovernmentUserUseCase } from './authenticate'

let governmentUsersRepository: GovernmentUsersRepository
let sut: AuthenticateGovernmentUserUseCase

vi.mock('@/libs/prisma')

describe('authenticate government user use case', () => {
  beforeEach(() => {
    governmentUsersRepository = new PrismaGovernmentUsersRepository()
    sut = new AuthenticateGovernmentUserUseCase(governmentUsersRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // TODO: test jwt
  it('should be able to authenticate a government user', async () => {
    const mockUser: GovernmentUser = {
      id: '123',
      email: 'janedoe@example.com',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    prisma.governmentUser.findUnique.mockResolvedValueOnce(mockUser)

    const { governmentUser } = await sut.execute({
      email: mockUser.email,
      password: '123456',
    })

    expect(governmentUser.id).toEqual(expect.any(String))
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
    const mockUser: GovernmentUser = {
      id: '123',
      email: 'janedoe@example.com',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    prisma.governmentUser.findUnique.mockResolvedValueOnce(mockUser)

    await expect(() =>
      sut.execute({
        email: mockUser.email,
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
