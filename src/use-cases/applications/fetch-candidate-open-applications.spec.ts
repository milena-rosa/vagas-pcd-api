import { prisma } from '@/libs/__mocks__/prisma'
import { ApplicationsRepository } from '@/repositories/applications-repository'
import { PrismaApplicationsRepository } from '@/repositories/prisma/prisma-applications-repository'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FetchCandidateOpenApplicationsUseCase } from './fetch-candidate-open-applications'

let applicationsRepository: ApplicationsRepository
let sut: FetchCandidateOpenApplicationsUseCase

vi.mock('@/libs/prisma')

describe('fetch candidate open applications use case', () => {
  beforeEach(() => {
    applicationsRepository = new PrismaApplicationsRepository()
    sut = new FetchCandidateOpenApplicationsUseCase(applicationsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should be able to fetch the candidate open applications list', async () => {
    vi.setSystemTime(new Date(2023, 2, 1))

    const mockApplications = [
      { id: '1', candidate_id: '123', job_id: '123', created_at: new Date() },
      { id: '2', candidate_id: '123', job_id: '124', created_at: new Date() },
      { id: '3', candidate_id: '123', job_id: '125', created_at: new Date() },
    ]
    prisma.application.findMany.mockResolvedValue(mockApplications)

    const { applications } = await sut.execute({ candidateId: '123' })

    expect(applications).toHaveLength(3)
    expect(applications).toStrictEqual(mockApplications)
  })

  it('should be able to fetch paginated candidate applications history', async () => {
    vi.setSystemTime(new Date(2023, 2, 1))

    const mockApplication = {
      candidate_id: '123',
      created_at: new Date(),
    }

    const mockApplications = []
    for (let i = 21; i <= 22; i++) {
      mockApplications.push({
        ...mockApplication,
        id: randomUUID(),
        job_id: `${i}`,
      })
    }

    prisma.application.findMany.mockResolvedValueOnce(mockApplications)

    const { applications, page } = await sut.execute({
      candidateId: '123',
      page: 2,
    })

    expect(page).toEqual(2)
    expect(applications).toHaveLength(2)
    expect(applications).toStrictEqual(mockApplications)
  })
})
