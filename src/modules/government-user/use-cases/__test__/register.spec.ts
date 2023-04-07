import { EmailAlreadyRegisteredError } from '@/errors/email-already-registered-error'
import { NotAllowedEmailError } from '@/errors/not-allowed-email-error'
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
import { RegisterGovernmentUserUseCase } from '../register'

let governmentUsersRepository: GovernmentUsersRepository
let usersRepository: UsersRepository
let sut: RegisterGovernmentUserUseCase

vi.mock('@/libs/prisma')

describe('register government user use case', () => {
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
    const mockUser = {
      user_id: randomUUID(),
      email: 'inss@gov.br',
      role: 'GOVERNMENT',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockGovernmentUser = {
      user_id: mockUser.user_id,
      user: mockUser,
    }

    prisma.governmentUser.create.mockResolvedValueOnce(mockGovernmentUser)

    const { governmentUser } = await sut.execute({
      email: mockGovernmentUser.user.email,
      password: '123456',
    })

    expect(governmentUser).toStrictEqual({
      created_at: mockGovernmentUser.user.created_at,
      user_id: mockGovernmentUser.user_id,
      email: mockGovernmentUser.user.email,
      password_hash: mockGovernmentUser.user.password_hash,
    })
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
      governmentUser.password_hash,
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

  it('should not be able to register with a non governamental email', async () => {
    const mockUser: User = {
      user_id: randomUUID(),
      email: 'inss@gmail.com',
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
    ).rejects.toBeInstanceOf(NotAllowedEmailError)
  })
})
