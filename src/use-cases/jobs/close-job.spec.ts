import { prisma } from '@/libs/__mocks__/prisma'
import { JobsRepository } from '@/repositories/jobs-repository'
import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { DisabilityType, Location } from '@prisma/client'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { JobClosedError } from '../errors/job-closed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { CloseJobUseCase } from './close-job'

let jobsRepository: JobsRepository
let sut: CloseJobUseCase

vi.mock('@/libs/prisma')

describe('close job use case', () => {
  beforeEach(() => {
    jobsRepository = new PrismaJobsRepository()
    sut = new CloseJobUseCase(jobsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('should be able to close job given a correct id', async () => {
    vi.setSystemTime(new Date(2023, 2, 1))

    const mockJob = {
      id: randomUUID(),
      title: 'Engenheiro(a) de software',
      description: 'Vaga massinha com uma descrição legal.',
      role: 'Analista',
      disability_type: DisabilityType.ANY,
      location: Location.ON_SITE,
      company_id: '123',
      salary: 10000,
      created_at: new Date(2023, 0, 1),
      closed_at: null,
    }

    prisma.job.findUnique.mockResolvedValueOnce(mockJob)
    prisma.job.update.mockResolvedValueOnce({
      ...mockJob,
      closed_at: new Date(),
    })

    const { job } = await sut.execute({ jobId: mockJob.id })

    expect(job).toStrictEqual({
      ...mockJob,
      closed_at: new Date(),
    })
  })

  it('should not be able to close the job given an incorrect id', async () => {
    await expect(() =>
      sut.execute({
        jobId: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to close an already closed job', async () => {
    vi.setSystemTime(new Date(2023, 2, 1))

    const mockJob = {
      id: randomUUID(),
      title: 'Engenheiro(a) de software',
      description: 'Vaga massinha com uma descrição legal.',
      role: 'Analista',
      disability_type: DisabilityType.ANY,
      location: Location.ON_SITE,
      company_id: '123',
      salary: 10000,
      created_at: new Date(2023, 0, 1),
      closed_at: new Date(2023, 1, 1),
    }

    prisma.job.update.mockResolvedValueOnce(mockJob)
    prisma.job.findUnique.mockResolvedValue(mockJob)

    await expect(() =>
      sut.execute({
        jobId: mockJob.id,
      }),
    ).rejects.toBeInstanceOf(JobClosedError)
  })
})
