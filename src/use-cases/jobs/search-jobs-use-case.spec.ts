import { prisma } from '@/libs/__mocks__/prisma'
import { JobsRepository } from '@/repositories/jobs-repository'
import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { DisabilityType, Location } from '@prisma/client'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SearchJobsUseCase } from './search-jobs-use-case'

let jobsRepository: JobsRepository
let sut: SearchJobsUseCase

vi.mock('@/libs/prisma')
// TODO: exceptions
// TODO: errors
describe('search jobs use case', () => {
  beforeEach(() => {
    jobsRepository = new PrismaJobsRepository()
    sut = new SearchJobsUseCase(jobsRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to search for jobs by company name', async () => {
    const newJob = {
      id: '123',
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

    const newCompany = {
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
    prisma.job.findMany.mockResolvedValueOnce([newJob])

    const { jobs } = await sut.execute({ query: 'Lojas Pônei' })

    expect(prisma.job.findMany).toHaveBeenCalledOnce()
    expect(jobs).toHaveLength(1)
    expect(jobs).toStrictEqual([newJob])
  })

  it('should be able to search for jobs by title', async () => {
    const mockJob = {
      id: '123',
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
    const mockJob = {
      id: '123',
      title: 'Engenheiro(a) de software',
      description: 'Vaga massinha com uma descrição legal.',
      role: 'Analista',
      disability_type: DisabilityType.HEARING,
      location: Location.ON_SITE,
      company_id: '123',
      salary: 10000,
      created_at: new Date(),
      closed_at: null,
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
    const mockJob = {
      id: '123',
      title: 'Engenheiro(a) de software',
      description: 'Vaga massinha com uma descrição legal.',
      role: 'Analista',
      disability_type: DisabilityType.HEARING,
      location: Location.REMOTE,
      company_id: '123',
      salary: 10000,
      created_at: new Date(),
      closed_at: null,
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
