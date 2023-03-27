import { prisma } from '@/libs/__mocks__/prisma'
import { JobsRepository } from '@/repositories/jobs-repository'
import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { getNewJob } from '@/utils/tests/get-new-job'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { JobAlreadyClosedError } from '../errors/job-already-closed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { CloseJobUseCase } from './close-job-use-case'

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

  it('should be able close the job given an correct id', async () => {
    vi.setSystemTime(new Date(2023, 2, 1))

    const newJob = getNewJob()
    prisma.job.update.mockResolvedValue({ ...newJob, closed_at: new Date() })
    prisma.job.findUnique.mockResolvedValue(newJob)

    const { job } = await sut.execute({ jobId: newJob.id })

    expect(job.id).toEqual(expect.any(String))
  })

  it('should not be able to close the job given an incorrect id', async () => {
    vi.setSystemTime(new Date(2023, 2, 1))

    prisma.job.update.mockRejectedValueOnce(new ResourceNotFoundError())

    await expect(() =>
      sut.execute({
        jobId: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to close an already closed job', async () => {
    vi.setSystemTime(new Date(2023, 2, 1))

    const newJob = { ...getNewJob(), closed_at: new Date() }
    prisma.job.update.mockResolvedValue(newJob)
    prisma.job.findUnique.mockResolvedValue(newJob)

    await expect(() =>
      sut.execute({
        jobId: newJob.id,
      }),
    ).rejects.toBeInstanceOf(JobAlreadyClosedError)
  })
})
