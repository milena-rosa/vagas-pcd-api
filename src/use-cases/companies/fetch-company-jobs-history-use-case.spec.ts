import { prisma } from '@/libs/__mocks__/prisma'
import { JobsRepository } from '@/repositories/jobs-repository'
import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { DisabilityType } from '@prisma/client'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FetchCompanyJobsHistoryUseCase } from './fetch-company-jobs-history-use-case'

let jobsRepository: JobsRepository
let sut: FetchCompanyJobsHistoryUseCase

vi.mock('@/libs/prisma')

describe('fetch company jobs history use case', () => {
  beforeEach(() => {
    jobsRepository = new PrismaJobsRepository()
    sut = new FetchCompanyJobsHistoryUseCase(jobsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should be able to fetch company jobs history use case', async () => {
    vi.setSystemTime(new Date(2023, 2, 1))

    prisma.job.findMany.mockResolvedValue([
      {
        id: randomUUID(),
        title: 'Engenheiro de software',
        description: 'Vaga massinha com uma descrição legal.',
        role: 'Analista',
        disability_type: DisabilityType.ANY,
        company_id: '123',
        salary: 10000,
        created_at: new Date(),
        closed_at: null,
      },
      {
        id: randomUUID(),
        title: 'Engenheiro de computação',
        description: 'Vaga massinha com uma descrição legal.',
        role: 'Analista',
        disability_type: DisabilityType.ANY,
        company_id: '123',
        salary: 10000,
        created_at: new Date(),
        closed_at: null,
      },
      {
        id: randomUUID(),
        title: 'Engenheiro de qualidade',
        description: 'Vaga massinha com uma descrição legal.',
        role: 'Analista',
        disability_type: DisabilityType.ANY,
        company_id: '123',
        salary: 10000,
        created_at: new Date(2023, 0, 1),
        closed_at: new Date(2023, 1, 1),
      },
    ])

    const { jobs } = await sut.execute({
      companyId: '123',
    })

    expect(jobs).toHaveLength(3)
    expect(jobs).toEqual([
      expect.objectContaining({ title: 'Engenheiro de software' }),
      expect.objectContaining({ title: 'Engenheiro de computação' }),
      expect.objectContaining({ title: 'Engenheiro de qualidade' }),
    ])
  })

  it('should be able to fetch paginated company jobs history', async () => {
    vi.setSystemTime(new Date(2023, 2, 1))
    const newJobs = []
    for (let i = 21; i <= 22; i++) {
      newJobs.push({
        id: randomUUID(),
        title: `Engenheiro ${i}`,
        description: 'Vaga massinha com uma descrição legal.',
        role: 'Analista',
        disability_type: DisabilityType.ANY,
        company_id: '123',
        salary: 10000,
        created_at: new Date(),
        closed_at: null,
      })
    }

    prisma.job.findMany.mockResolvedValue(newJobs)

    const { jobs, page } = await sut.execute({
      companyId: '123',
      page: 2,
    })

    expect(page).toEqual(2)
    expect(jobs).toHaveLength(2)
    expect(jobs).toEqual([
      expect.objectContaining({ title: 'Engenheiro 21' }),
      expect.objectContaining({ title: 'Engenheiro 22' }),
    ])
  })
})
