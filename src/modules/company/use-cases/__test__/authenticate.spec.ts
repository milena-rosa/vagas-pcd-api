import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { prisma } from '@/libs/__mocks__/prisma'
import {
  CompaniesRepository,
  CompanyUser,
} from '@/repositories/companies-repository'
import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthenticateCompanyUseCase } from '../authenticate'

let usersRepository: UsersRepository
let companiesRepository: CompaniesRepository
let sut: AuthenticateCompanyUseCase

vi.mock('@/libs/prisma')

describe('authenticate company use case', () => {
  beforeEach(() => {
    usersRepository = new PrismaUsersRepository()
    companiesRepository = new PrismaCompaniesRepository()
    sut = new AuthenticateCompanyUseCase(usersRepository, companiesRepository)
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

    const mockCompany: CompanyUser = {
      company_id: mockUser.user_id,
      cnpj: '23.243.199/0001-84',
      name: 'Lojas Pônei',
      city: 'Poneilandia',
      state: 'SP',
      street: 'Rua dos Bobos',
      number: '0',
      phone: '11999222333',
      zip_code: '13636085',
      complement: '',
      user: mockUser,
    }

    prisma.user.findUnique.mockResolvedValueOnce(mockUser)
    prisma.company.findUnique.mockResolvedValueOnce(mockCompany)

    const { company } = await sut.execute({
      email: mockUser.email,
      password: '123456',
    })

    expect(company.company_id).toStrictEqual(mockCompany.company_id)
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
