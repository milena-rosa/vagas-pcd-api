import { prisma } from '@/libs/__mocks__/prisma'
import { CompaniesRepository } from '@/repositories/companies-repository'
import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { getNewCompany } from '@/utils/tests/get-new-company'
import { Company } from '@prisma/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { FetchCompanyInformationUseCase } from './fetch-company-information-use-case'

let companiesRepository: CompaniesRepository
let sut: FetchCompanyInformationUseCase

vi.mock('@/libs/prisma')

describe('fetch company profile use case', () => {
  beforeEach(() => {
    companiesRepository = new PrismaCompaniesRepository()
    sut = new FetchCompanyInformationUseCase(companiesRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to fetch a company profile with cnpj', async () => {
    const newCompany: Company = await getNewCompany()

    prisma.company.findUnique.mockResolvedValue(newCompany)

    const { company } = await sut.execute({
      cnpj: newCompany.cnpj,
    })

    expect(company.name).toEqual('ARIOVALDO DE OLIVEIRA')
  })

  it('should not be able to fetch a company profile with an inexistent cnpj', async () => {
    await expect(() =>
      sut.execute({
        cnpj: 'inexistent-cnpj',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
