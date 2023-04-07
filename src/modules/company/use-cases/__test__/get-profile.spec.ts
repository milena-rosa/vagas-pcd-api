import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/libs/__mocks__/prisma'
import {
  CompaniesRepository,
  CompanyUser,
} from '@/repositories/companies-repository'
import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GetCompanyProfileUseCase } from '../get-profile'

let companiesRepository: CompaniesRepository
let sut: GetCompanyProfileUseCase

vi.mock('@/libs/prisma')

describe('get company profile use case', () => {
  beforeEach(() => {
    companiesRepository = new PrismaCompaniesRepository()
    sut = new GetCompanyProfileUseCase(companiesRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to fetch a company profile with cnpj', async () => {
    const mockUser: User = {
      user_id: randomUUID(),
      email: 'lojasponei@example.com',
      role: 'COMPANY',
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

    prisma.company.findUnique.mockResolvedValueOnce(mockCompany)

    const { company } = await sut.execute({
      company_id: mockCompany.company_id,
    })

    expect(company).toStrictEqual({
      company_id: mockCompany.company_id,
      cnpj: mockCompany.cnpj,
      name: mockCompany.name,
      email: mockCompany.user.email,
      phone: mockCompany.phone,
      street: mockCompany.street,
      number: mockCompany.number,
      complement: mockCompany.complement,
      city: mockCompany.city,
      state: mockCompany.state,
      zip_code: mockCompany.zip_code,
      password_hash: mockCompany.user.password_hash,
      created_at: mockCompany.user.created_at,
    })
  })

  it('should not be able to fetch a company profile with an inexistent cnpj', async () => {
    await expect(() =>
      sut.execute({ company_id: 'inexistent-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
