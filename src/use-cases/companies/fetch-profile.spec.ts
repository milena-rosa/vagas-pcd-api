import { prisma } from '@/libs/__mocks__/prisma'
import { CompaniesRepository } from '@/repositories/companies-repository'
import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { Company } from '@prisma/client'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { FetchCompanyProfileUseCase } from './fetch-profile'

let companiesRepository: CompaniesRepository
let sut: FetchCompanyProfileUseCase

vi.mock('@/libs/prisma')

describe('fetch company profile use case', () => {
  beforeEach(() => {
    companiesRepository = new PrismaCompaniesRepository()
    sut = new FetchCompanyProfileUseCase(companiesRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to fetch a company profile with cnpj', async () => {
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

    prisma.company.findUnique.mockResolvedValueOnce(newCompany)

    const { company } = await sut.execute({ cnpj: newCompany.cnpj })

    expect(company).toStrictEqual(newCompany)
  })

  it('should not be able to fetch a company profile with an inexistent cnpj', async () => {
    await expect(() =>
      sut.execute({
        cnpj: 'inexistent-cnpj',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
