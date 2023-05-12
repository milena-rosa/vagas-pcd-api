import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/libs/__mocks__/prisma'
import { CompanyUser } from '@/repositories/companies-repository'
import { JobsRepository } from '@/repositories/jobs-repository'
import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { DisabilityType, Location, User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GetJobWithCompanyUseCase } from '../get-job-with-company'

let jobsRepository: JobsRepository
let sut: GetJobWithCompanyUseCase

vi.mock('@/libs/prisma')

describe('get job use case', () => {
  beforeEach(() => {
    jobsRepository = new PrismaJobsRepository()
    sut = new GetJobWithCompanyUseCase(jobsRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to get info of a job given an id', async () => {
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
      linkedin: 'https://www.linkedin.com/company/lojasponei/',
      about: 'Lojas Ponei é uma empresa massinha.',
      name: 'Lojas Pônei',
      city: 'Poneilandia',
      state: 'SP',
      street: 'Rua dos Bobos',
      number: '0',
      phone: '11999222333',
      zip_code: '13636085',
      complement: null,
      user: mockUser,
    }

    const mockJob = {
      job_id: randomUUID(),
      company_id: mockCompany.company_id,
      title: 'Engenheiro(a) de software',
      description: 'Vaga massinha com uma descrição legal.',
      role: 'Analista',
      disability_type: DisabilityType.ANY,
      location: Location.ON_SITE,
      salary: 10000,
      linkedin: 'https://www.linkedin.com/jobs/view/3580802802',
      perks:
        '- Vale alimentação: R$ 500,00;\n - Vale refeição: R$ 1000,00;\n- Plano de saúde;\n-Gympass.',
      created_at: new Date(),
      closed_at: null,
      company: mockCompany,
    }

    prisma.company.findUnique.mockResolvedValueOnce(mockCompany)
    prisma.job.findUnique.mockResolvedValueOnce(mockJob)

    const { job } = await sut.execute({ job_id: mockJob.job_id })

    expect(job).toEqual(
      expect.objectContaining({
        title: mockJob.title,
      }),
    )
  })

  it('should not be able to fetch a job with a wrong id', async () => {
    await expect(() =>
      sut.execute({ job_id: 'inexistent-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
