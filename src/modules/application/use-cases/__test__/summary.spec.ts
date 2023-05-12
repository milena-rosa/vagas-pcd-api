import { prisma } from '@/libs/__mocks__/prisma'
import { ApplicationsRepository } from '@/repositories/applications-repository'
import { PrismaApplicationsRepository } from '@/repositories/prisma/prisma-applications-repository'
import { DisabilityType, Location } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SummaryUseCase } from '../summary'

let applicationsRepository: ApplicationsRepository
let sut: SummaryUseCase

vi.mock('@/libs/prisma')

describe('fetch summary report use case', () => {
  beforeEach(() => {
    applicationsRepository = new PrismaApplicationsRepository()
    sut = new SummaryUseCase(applicationsRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to fetch the summary report', async () => {
    const mockCompanyUser = {
      user_id: randomUUID(),
      email: 'lojasponei@example.com',
      role: 'COMPANY',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCompany = {
      company_id: mockCompanyUser.user_id,
      cnpj: '23.243.199/0001-84',
      name: 'Lojas Pônei',
      city: 'Poneilandia',
      state: 'SP',
      street: 'Rua dos Bobos',
      number: '0',
      phone: '11999222333',
      zip_code: '13636085',
      complement: '',
      user: mockCompanyUser,
    }

    const mockCandidateUser = {
      user_id: randomUUID(),
      email: 'janedoe@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockJob = {
      company_id: mockCompanyUser.user_id,
      company: mockCompany,
      title: 'Engenheiro(a) de software',
      description: 'Vaga massinha com uma descrição legal.',
      role: 'Analista',
      linkedin: 'https://www.linkedin.com/jobs/view/3580802802',
      perks:
        '- Vale alimentação: R$ 500,00;\n - Vale refeição: R$ 1000,00;\n- Plano de saúde;\n-Gympass.',
      disability_type: DisabilityType.ANY,
      location: Location.ON_SITE,
      salary: 10000,
      closed_at: null,
    }

    const mockJobs = []
    for (let i = 1; i <= 3; i++) {
      mockJobs.push({
        ...mockJob,
        job_id: randomUUID(),
        created_at: new Date(),
      })
    }

    const mockApplication = {
      candidate_id: mockCandidateUser.user_id,
      job: mockJob,
      created_at: new Date(),
    }

    const mockApplications = []
    for (let i = 1; i <= 3; i++) {
      mockApplications.push({
        ...mockApplication,
        id: randomUUID(),
        job_id: mockJobs[i - 1].job_id,
      })
    }

    prisma.application.findMany.mockResolvedValueOnce(mockApplications)

    const mockReport = [
      {
        company_name: mockCompany.name,
        company_cnpj: mockCompany.cnpj,
        company_phone: mockCompany.phone,
        company_city: mockCompany.city,
        company_state: mockCompany.state,
        company_street: mockCompany.street,
        company_number: mockCompany.number,
        company_zip_code: mockCompany.zip_code,
        company_complement: mockCompany.complement,
        n_jobs: mockJobs.length,
        n_applications: mockApplications.length,
      },
    ]
    prisma.$queryRaw.mockResolvedValueOnce(mockReport)

    const { summary } = await sut.execute()

    expect(summary).toHaveLength(1)
  })
})
