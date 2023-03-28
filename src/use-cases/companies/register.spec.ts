import { prisma } from '@/libs/__mocks__/prisma'
import { CompaniesRepository } from '@/repositories/companies-repository'
import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { Company } from '@prisma/client'
import { compare, hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CNPJAlreadyRegisteredError } from '../errors/cnpj-already-registered-error'
import { EmailAlreadyRegisteredError } from '../errors/email-already-registered-error'
import { RegisterCompanyUseCase } from './register'

let companiesRepository: CompaniesRepository
let sut: RegisterCompanyUseCase

vi.mock('@/libs/prisma')

describe('register company use case', () => {
  beforeEach(() => {
    companiesRepository = new PrismaCompaniesRepository()
    sut = new RegisterCompanyUseCase(companiesRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to register a company', async () => {
    const newCompany: Company = {
      id: '123',
      cnpj: '23.243.199/0001-84',
      email: 'lojasponei@example.com',
      name: 'Lojas Pônei',
      password_hash: await hash('123456', 6),
      city: 'Pirassununga',
      state: 'SP',
      street: 'Rua dos Bobos',
      number: '0',
      phone: '11999222333',
      zipCode: '13636085',
      complement: null,
    }
    prisma.company.create.mockResolvedValueOnce(newCompany)

    const { company } = await sut.execute({
      email: newCompany.email,
      password: '123456',
      cnpj: newCompany.cnpj,
    })

    expect(company).toStrictEqual(newCompany)
  })

  it('should hash company password on registry', async () => {
    const newCompany: Company = {
      id: '123',
      cnpj: '23.243.199/0001-84',
      email: 'lojasponei@example.com',
      name: 'Lojas Pônei',
      password_hash: await hash('123456', 6),
      city: 'Pirassununga',
      state: 'SP',
      street: 'Rua dos Bobos',
      number: '0',
      phone: '11999222333',
      zipCode: '13636085',
      complement: null,
    }

    prisma.company.create.mockResolvedValueOnce(newCompany)

    const { company } = await sut.execute({
      email: newCompany.email,
      password: '123456',
      cnpj: newCompany.cnpj,
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      company.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register a company with an email twice', async () => {
    prisma.company.findUnique.mockImplementationOnce(() => {
      throw new EmailAlreadyRegisteredError()
    })

    await expect(() =>
      sut.execute({
        email: 'janedoe@example.com',
        password: '123456',
        cnpj: '23.111.111/0001-11',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyRegisteredError)
  })

  it('should not be able to register a company with a cnpj twice', async () => {
    prisma.company.findUnique.mockImplementationOnce(() => {
      throw new CNPJAlreadyRegisteredError()
    })

    await expect(() =>
      sut.execute({
        cnpj: '23.111.111/0001-11',
        email: 'new@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(CNPJAlreadyRegisteredError)
  })
})
