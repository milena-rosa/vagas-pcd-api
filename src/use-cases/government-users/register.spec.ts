import { prisma } from '@/libs/__mocks__/prisma'
import {
  GovernmentUser,
  GovernmentUsersRepository,
} from '@/repositories/government-users-repository'
import { PrismaGovernmentUsersRepository } from '@/repositories/prisma/prisma-government-users-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { compare, hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EmailAlreadyRegisteredError } from '../errors/email-already-registered-error'
import { RegisterGovernmentUserUseCase } from './register'

let governmentUsersRepository: GovernmentUsersRepository
let usersRepository: UsersRepository
let sut: RegisterGovernmentUserUseCase

vi.mock('@/libs/prisma')

describe('register candidate use case', () => {
  beforeEach(() => {
    governmentUsersRepository = new PrismaGovernmentUsersRepository()
    usersRepository = new PrismaUsersRepository()
    sut = new RegisterGovernmentUserUseCase(
      usersRepository,
      governmentUsersRepository,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to register a government user', async () => {
    const mockUser: User = {
      user_id: randomUUID(),
      email: 'inss@gov.br',
      role: 'GOVERNMENT',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockGovernmentUser: GovernmentUser = {
      id: randomUUID(),
      user_id: mockUser.user_id,
      user: mockUser,
    }

    prisma.governmentUser.create.mockResolvedValueOnce(mockGovernmentUser)

    const { governmentUser } = await sut.execute({
      email: mockGovernmentUser.user.email,
      password: '123456',
    })

    expect(governmentUser).toStrictEqual(mockGovernmentUser)
  })

  it('should hash government user password on registry', async () => {
    const mockUser: User = {
      user_id: randomUUID(),
      email: 'inss@gov.br',
      role: 'GOVERNMENT',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockGovernmentUser: GovernmentUser = {
      id: randomUUID(),
      user_id: mockUser.user_id,
      user: mockUser,
    }

    prisma.governmentUser.create.mockResolvedValueOnce(mockGovernmentUser)

    const { governmentUser } = await sut.execute({
      email: mockUser.email,
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      governmentUser.user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with an email twice', async () => {
    const mockUser: User = {
      user_id: randomUUID(),
      email: 'inss@gov.br',
      role: 'GOVERNMENT',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    prisma.user.findUnique.mockResolvedValueOnce(mockUser)

    await expect(() =>
      sut.execute({
        email: mockUser.email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyRegisteredError)
  })
})
