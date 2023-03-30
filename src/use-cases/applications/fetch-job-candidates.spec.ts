import { prisma } from '@/libs/__mocks__/prisma'
import { ApplicationsRepository } from '@/repositories/applications-repository'
import { PrismaApplicationsRepository } from '@/repositories/prisma/prisma-applications-repository'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FetchJobCandidatesUseCase } from './fetch-job-candidates'

let applicationsRepository: ApplicationsRepository
let sut: FetchJobCandidatesUseCase

vi.mock('@/libs/prisma')

describe('fetch job candidates use case', () => {
  beforeEach(() => {
    applicationsRepository = new PrismaApplicationsRepository()
    sut = new FetchJobCandidatesUseCase(applicationsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should be able to fetch the candidates of a job', async () => {
    vi.setSystemTime(new Date(2023, 2, 1))

    const mockApplications = [
      { id: '1', candidate_id: '123', job_id: '123', created_at: new Date() },
      { id: '2', candidate_id: '124', job_id: '123', created_at: new Date() },
      { id: '3', candidate_id: '125', job_id: '123', created_at: new Date() },
    ]

    prisma.application.findMany.mockResolvedValue(mockApplications)

    const { applications } = await sut.execute({
      companyId: '123',
      jobId: '123',
    })

    expect(applications).toHaveLength(3)
    expect(applications).toStrictEqual(mockApplications)
  })

  it('should be able to fetch paginated candidates of a job', async () => {
    vi.setSystemTime(new Date(2023, 2, 1))

    const mockApplication = {
      job_id: '123',
      created_at: new Date(),
    }

    const mockApplications = []
    for (let i = 21; i <= 22; i++) {
      mockApplications.push({
        ...mockApplication,
        id: randomUUID(),
        candidate_id: `${i}`,
      })
    }

    prisma.application.findMany.mockResolvedValueOnce(mockApplications)

    const { applications, page } = await sut.execute({
      companyId: '123',
      jobId: '123',
      page: 2,
    })

    expect(page).toEqual(2)
    expect(applications).toHaveLength(2)
    expect(applications).toStrictEqual(mockApplications)
  })
})
