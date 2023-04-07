import { prisma } from '@/libs/__mocks__/prisma'
import { CompanyUser } from '@/repositories/companies-repository'
import { JobsRepository } from '@/repositories/jobs-repository'
import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { formatJobWithCompany } from '@/utils/format-job-with-company'
import { DisabilityType, Location, User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SearchJobsUseCase } from '../search-jobs'

let jobsRepository: JobsRepository
let sut: SearchJobsUseCase

vi.mock('@/libs/prisma')

describe('search jobs use case', () => {
  beforeEach(() => {
    jobsRepository = new PrismaJobsRepository()
    sut = new SearchJobsUseCase(jobsRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to search for jobs by company name', async () => {
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
      created_at: new Date(),
      closed_at: null,
      company: mockCompany,
    }

    prisma.company.findUnique.mockResolvedValueOnce(mockCompany)
    prisma.job.findMany.mockResolvedValueOnce([mockJob])

    const { jobs } = await sut.execute({ query: 'Lojas Pônei' })

    expect(prisma.job.findMany).toHaveBeenCalledOnce()
    expect(jobs).toHaveLength(1)
    expect(jobs).toEqual([formatJobWithCompany(mockJob)])
  })

  it('should be able to search for jobs by title', async () => {
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
      created_at: new Date(),
      closed_at: null,
      company: mockCompany,
    }

    prisma.job.findMany.mockResolvedValueOnce([mockJob])

    const { jobs } = await sut.execute({
      query: 'engenheiro',
    })

    expect(prisma.job.findMany).toHaveBeenCalledOnce()
    expect(jobs).toHaveLength(1)
    expect(jobs).toEqual([
      expect.objectContaining({
        title: 'Engenheiro(a) de software',
      }),
    ])
  })

  it('should be able to search for jobs by type of disability', async () => {
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
      created_at: new Date(),
      closed_at: null,
      company: mockCompany,
    }

    prisma.job.findMany.mockResolvedValueOnce([mockJob])

    const { jobs } = await sut.execute({
      query: 'audição',
    })

    expect(prisma.job.findMany).toHaveBeenCalledOnce()
    expect(jobs).toHaveLength(1)
    expect(jobs).toEqual([
      expect.objectContaining({
        title: 'Engenheiro(a) de software',
      }),
    ])
  })

  it('should be able to search for jobs by type of locale', async () => {
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
      created_at: new Date(),
      closed_at: null,
      company: mockCompany,
    }

    prisma.job.findMany.mockResolvedValueOnce([mockJob])

    const { jobs } = await sut.execute({
      query: 'remoto',
    })

    expect(prisma.job.findMany).toHaveBeenCalledOnce()
    expect(jobs).toHaveLength(1)
    expect(jobs).toEqual([
      expect.objectContaining({
        title: 'Engenheiro(a) de software',
      }),
    ])
  })
})
