import { prisma } from '@/libs/__mocks__/prisma'
import { JobsRepository } from '@/repositories/jobs-repository'
import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { getNewJob } from '@/utils/tests/get-new-job'
import { Job } from '@prisma/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateJobUseCase } from './create-job-use-case'

let jobsRepository: JobsRepository
let sut: CreateJobUseCase

vi.mock('@/libs/prisma')

describe('register company use case', () => {
  beforeEach(() => {
    jobsRepository = new PrismaJobsRepository()
    sut = new CreateJobUseCase(jobsRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to create a job', async () => {
    const newJob: Job = await getNewJob()
    prisma.job.create.mockResolvedValue(newJob)

    const { job } = await sut.execute({
      companyId: newJob.company_id,
      disabilityType: newJob.disability_type,
      ...newJob,
    })

    expect(job.id).toEqual(expect.any(String))
    expect(job.title).toEqual(newJob.title)
  })
})
