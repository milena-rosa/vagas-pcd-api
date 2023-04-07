import { prisma } from '@/libs/__mocks__/prisma'
import { CompaniesRepository } from '@/repositories/companies-repository'
import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { Company, DisabilityType, Job, Location } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FetchSummaryReportUseCase } from './fetch-summary-report'

let companiesRepository: CompaniesRepository
let sut: FetchSummaryReportUseCase

vi.mock('@/libs/prisma')

describe.skip('fetch summary report use case', () => {
  beforeEach(() => {
    companiesRepository = new PrismaCompaniesRepository()
    sut = new FetchSummaryReportUseCase(companiesRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to fetch the summary report', async () => {
    const mockCompany: Company = {
      company_id: '123',
      cnpj: '23.243.199/0001-84',
      email: 'lojasponei@example.com',
      name: 'Lojas Pônei',
      password_hash: await hash('123456', 6),
      city: 'Poneilandia',
      state: 'SP',
      street: 'Rua dos Bobos',
      number: '0',
      phone: '11999222333',
      zipCode: '13636085',
      complement: null,
    }

    const mockJob = {
      description: 'Vaga massinha com uma descrição legal.',
      role: 'Analista',
      disability_type: DisabilityType.ANY,
      location: Location.ON_SITE,
      company_id: '123',
      salary: 10000,
      created_at: new Date(),
      closed_at: null,
    }

    const mockJobs: Job[] = [
      {
        ...mockJob,
        id: randomUUID(),
        title: 'Engenheiro de software',
      },
      {
        ...mockJob,
        id: randomUUID(),
        title: 'Engenheiro de computação',
      },
      {
        ...mockJob,
        id: randomUUID(),
        title: 'Engenheiro de qualidade',
        created_at: new Date(2023, 0, 1),
        closed_at: new Date(2023, 1, 1),
      },
    ]

    const mockApplications = [
      { id: '1', candidate_id: '123', job_id: '123', created_at: new Date() },
      { id: '2', candidate_id: '123', job_id: '124', created_at: new Date() },
      { id: '3', candidate_id: '123', job_id: '125', created_at: new Date() },
    ]

    // prisma.job.findMany.mockResolvedValue(mockJobs)

    const mockReport = [
      {
        company: {
          name: mockCompany.name,
          cnpj: mockCompany.cnpj,
          email: mockCompany.email,
          phone: mockCompany.phone,
          city: mockCompany.city,
          state: mockCompany.state,
          street: mockCompany.street,
          number: mockCompany.number,
          zipCode: mockCompany.zipCode,
          complement: mockCompany.complement,
          jobs: mockJobs.length,
          applications: mockApplications.length,
        },
      },
    ]
    prisma.company.findMany.mockResolvedValue(mockReport)

    const { applications } = await sut.execute({ candidateId: '123' })

    expect(applications).toHaveLength(3)
    expect(applications).toStrictEqual(mockApplications)
  })
})
