import { prisma } from '@/libs/__mocks__/prisma'
import { CompaniesRepository } from '@/repositories/companies-repository'
import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { getNewCompany } from '@/utils/tests/get-new-company'
import { Company } from '@prisma/client'
import { compare } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EmailAlreadyRegisteredError } from '../errors/email-already-registered-error'
import { RegisterCompanyUseCase } from './register-company-use-case'

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
    const newCompany: Company = await getNewCompany()
    prisma.company.create.mockResolvedValue(newCompany)

    const { company } = await sut.execute({
      email: newCompany.email,
      password: '123456',
      cnpj: newCompany.cnpj,
    })

    expect(company.id).toEqual(expect.any(String))
    expect(company.cnpj).toEqual(newCompany.cnpj)
  })

  it('should hash company password on registry', async () => {
    const newCompany: Company = await getNewCompany()
    prisma.company.create.mockResolvedValue(newCompany)

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
    const newCompany: Company = await getNewCompany()

    prisma.company.create
      .mockResolvedValueOnce(newCompany)
      .mockRejectedValueOnce(new EmailAlreadyRegisteredError())

    await sut.execute({
      email: newCompany.email,
      password: '123456',
      cnpj: newCompany.cnpj,
    })

    await expect(() =>
      sut.execute({
        email: newCompany.email,
        password: '123456',
        cnpj: newCompany.cnpj,
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyRegisteredError)
  })

  it('should not be able to register a company with a cnpj twice', async () => {
    const newCompany: Company = await getNewCompany()

    prisma.company.create
      .mockResolvedValueOnce(newCompany)
      .mockRejectedValueOnce(new EmailAlreadyRegisteredError())

    await sut.execute({
      email: newCompany.email,
      password: '123456',
      cnpj: newCompany.cnpj,
    })

    await expect(() =>
      sut.execute({
        email: 'other-email',
        password: '123456',
        cnpj: newCompany.cnpj,
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyRegisteredError)
  })
})
