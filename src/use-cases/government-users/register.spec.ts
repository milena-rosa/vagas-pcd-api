import { prisma } from '@/libs/__mocks__/prisma'
import { GovernmentUsersRepository } from '@/repositories/government-users-repository'
import { PrismaGovernmentUsersRepository } from '@/repositories/prisma/prisma-government-users-repository'
import { GovernmentUser } from '@prisma/client'
import { compare, hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EmailAlreadyRegisteredError } from '../errors/email-already-registered-error'
import { RegisterGovernmentUserUseCase } from './register'

let governmentUsersRepository: GovernmentUsersRepository
let sut: RegisterGovernmentUserUseCase

vi.mock('@/libs/prisma')

describe('register candidate use case', () => {
  beforeEach(() => {
    governmentUsersRepository = new PrismaGovernmentUsersRepository()
    sut = new RegisterGovernmentUserUseCase(governmentUsersRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to register a government user', async () => {
    const mockUser: GovernmentUser = {
      id: '123',
      email: 'janedoe@example.com',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    prisma.governmentUser.create.mockResolvedValueOnce(mockUser)

    const { governmentUser } = await sut.execute({
      email: mockUser.email,
      password: '123456',
    })

    expect(governmentUser).toStrictEqual(mockUser)
  })

  it('should hash government user password on registry', async () => {
    const mockUser: GovernmentUser = {
      id: '123',
      email: 'janedoe@example.com',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    prisma.governmentUser.create.mockResolvedValueOnce(mockUser)

    const { governmentUser } = await sut.execute({
      email: mockUser.email,
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      governmentUser.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with an email twice', async () => {
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
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyRegisteredError)
  })
})
