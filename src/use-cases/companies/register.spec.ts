import { prisma } from '@/libs/__mocks__/prisma'
import {
  CompaniesRepository,
  CompanyUser,
} from '@/repositories/companies-repository'
import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { compare, hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CNPJAlreadyRegisteredError } from '../errors/cnpj-already-registered-error'
import { EmailAlreadyRegisteredError } from '../errors/email-already-registered-error'
import { RegisterCompanyUseCase } from './register'

let companiesRepository: CompaniesRepository
let usersRepository: UsersRepository
let sut: RegisterCompanyUseCase

vi.mock('@/libs/prisma')

describe('register company use case', () => {
  beforeEach(() => {
    companiesRepository = new PrismaCompaniesRepository()
    usersRepository = new PrismaUsersRepository()
    sut = new RegisterCompanyUseCase(usersRepository, companiesRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to register a company', async () => {
    const mockUser: User = {
      user_id: randomUUID(),
      email: 'lojasponei@example.com',
      role: 'COMPANY',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCompany: CompanyUser = {
      id: randomUUID(),
      cnpj: '23.243.199/0001-84',
      name: 'Lojas Pônei',
      city: 'Pirassununga',
      state: 'SP',
      street: 'Rua dos Bobos',
      number: '0',
      phone: '11999222333',
      zipCode: '13636085',
      complement: null,
      user_id: mockUser.user_id,
      user: mockUser,
    }

    prisma.company.create.mockResolvedValueOnce(mockCompany)

    const { company } = await sut.execute({
      email: mockUser.email,
      password: '123456',
      cnpj: mockCompany.cnpj,
    })

    expect(company).toStrictEqual(mockCompany)
  })

  it('should hash company password on registry', async () => {
    const mockUser: User = {
      user_id: randomUUID(),
      email: 'lojasponei@example.com',
      role: 'COMPANY',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCompany: CompanyUser = {
      id: randomUUID(),
      cnpj: '23.243.199/0001-84',
      name: 'Lojas Pônei',
      city: 'Pirassununga',
      state: 'SP',
      street: 'Rua dos Bobos',
      number: '0',
      phone: '11999222333',
      zipCode: '13636085',
      complement: null,
      user_id: mockUser.user_id,
      user: mockUser,
    }

    prisma.company.create.mockResolvedValueOnce(mockCompany)

    const { company } = await sut.execute({
      email: mockUser.email,
      password: '123456',
      cnpj: mockCompany.cnpj,
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      company.user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register a company with an email twice', async () => {
    const mockUser: User = {
      user_id: randomUUID(),
      email: 'lojasponei@example.com',
      role: 'COMPANY',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    prisma.user.findUnique.mockResolvedValueOnce(mockUser)

    await expect(() =>
      sut.execute({
        email: mockUser.email,
        password: '123456',
        cnpj: '23.111.111/0001-11',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyRegisteredError)
  })

  it('should not be able to register a company with a cnpj twice', async () => {
    const mockUser: User = {
      user_id: randomUUID(),
      email: 'lojasponei@example.com',
      role: 'COMPANY',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCompany: CompanyUser = {
      id: randomUUID(),
      cnpj: '23.243.199/0001-84',
      name: 'Lojas Pônei',
      city: 'Pirassununga',
      state: 'SP',
      street: 'Rua dos Bobos',
      number: '0',
      phone: '11999222333',
      zipCode: '13636085',
      complement: null,
      user_id: mockUser.user_id,
      user: mockUser,
    }

    prisma.company.findUnique.mockResolvedValueOnce(mockCompany)

    await expect(() =>
      sut.execute({
        email: 'new@example.com',
        cnpj: mockCompany.cnpj,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(CNPJAlreadyRegisteredError)
  })
})
