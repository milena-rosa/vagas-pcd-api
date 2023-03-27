import { prisma } from '@/libs/__mocks__/prisma'
import { CompaniesRepository } from '@/repositories/companies-repository'
import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { getNewCompany } from '@/utils/tests/get-new-company'
import { Company } from '@prisma/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { AuthenticateCompanyUseCase } from './authenticate-company-use-case'

let companiesRepository: CompaniesRepository
let sut: AuthenticateCompanyUseCase

vi.mock('@/libs/prisma')

describe('authenticate company use case', () => {
  beforeEach(() => {
    companiesRepository = new PrismaCompaniesRepository()
    sut = new AuthenticateCompanyUseCase(companiesRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to authenticate a company with email', async () => {
    const newCompany: Company = await getNewCompany()

    prisma.company.findUnique.mockResolvedValue(newCompany)

    const { company } = await sut.execute({
      emailOrCnpj: newCompany.email,
      password: '123456',
    })

    expect(company.id).toEqual(expect.any(String))
  })

  it('should be able to authenticate a company with cnpj', async () => {
    const newCompany: Company = await getNewCompany()

    prisma.company.findUnique.mockResolvedValue(newCompany)

    const { company } = await sut.execute({
      emailOrCnpj: newCompany.cnpj,
      password: '123456',
    })

    expect(company.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with a wrong email', async () => {
    await expect(() =>
      sut.execute({
        emailOrCnpj: 'non-existent@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with a wrong cnpj', async () => {
    await expect(() =>
      sut.execute({
        emailOrCnpj: 'non-existent-cnpj',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with empty cnpj and email', async () => {
    await expect(() =>
      sut.execute({
        emailOrCnpj: '',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with a wrong password', async () => {
    const newCompany: Company = await getNewCompany()

    prisma.company.findUnique.mockResolvedValue(newCompany)

    await expect(() =>
      sut.execute({
        emailOrCnpj: newCompany.email,
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
