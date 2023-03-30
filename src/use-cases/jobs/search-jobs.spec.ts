import { prisma } from '@/libs/__mocks__/prisma'
import { JobsRepository } from '@/repositories/jobs-repository'
import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { DisabilityType, Location, User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SearchJobsUseCase } from './search-jobs'

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

    const mockUser: User = {
      user_id: randomUUID(),
      email: 'lojasponei@example.com',
      role: 'COMPANY',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    prisma.user.findUnique.mockResolvedValueOnce(mockUser)
    prisma.job.findMany.mockResolvedValueOnce([mockJob])

    const { jobs } = await sut.execute({ query: 'Lojas Pônei' })

    expect(prisma.job.findMany).toHaveBeenCalledOnce()
    expect(jobs).toHaveLength(1)
    expect(jobs).toStrictEqual([mockJob])
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
