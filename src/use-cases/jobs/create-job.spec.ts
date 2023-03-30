import { prisma } from '@/libs/__mocks__/prisma'
import {
  CompaniesRepository,
  CompanyUser,
} from '@/repositories/companies-repository'
import { JobsRepository } from '@/repositories/jobs-repository'
import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { DisabilityType, Location, User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { CreateJobUseCase } from './create-job'

let jobsRepository: JobsRepository
let companiesRepository: CompaniesRepository
let sut: CreateJobUseCase

vi.mock('@/libs/prisma')

describe('register company use case', () => {
  beforeEach(() => {
    jobsRepository = new PrismaJobsRepository()
    companiesRepository = new PrismaCompaniesRepository()
    sut = new CreateJobUseCase(jobsRepository, companiesRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to create a job', async () => {
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

    const mockJob = {
      id: randomUUID(),
      title: 'Engenheiro(a) de software',
      description: 'Vaga massinha com uma descrição legal.',
      role: 'Analista',
      disability_type: DisabilityType.ANY,
      location: Location.ON_SITE,
      company_id: '123',
      salary: 10000,
      created_at: new Date(),
      closed_at: null,
    }

    prisma.company.findFirst.mockResolvedValue(mockCompany)
    prisma.job.create.mockResolvedValueOnce(mockJob)

    const { job } = await sut.execute({
      companyId: mockJob.company_id,
      disabilityType: mockJob.disability_type,
      ...mockJob,
    })

    expect(job).toStrictEqual(mockJob)
  })

  it('should not be able to create a job with a wrong company id', async () => {
    const mockJob = {
      id: randomUUID(),
      title: 'Engenheiro(a) de software',
      description: 'Vaga massinha com uma descrição legal.',
      role: 'Analista',
      disability_type: DisabilityType.ANY,
      location: Location.ON_SITE,
      company_id: '123',
      salary: 10000,
      created_at: new Date(),
      closed_at: null,
    }

    prisma.job.create.mockResolvedValueOnce(mockJob)

    await expect(() =>
      sut.execute({
        companyId: mockJob.company_id,
        disabilityType: mockJob.disability_type,
        ...mockJob,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
