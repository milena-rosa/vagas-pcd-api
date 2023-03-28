import { prisma } from '@/libs/__mocks__/prisma'
import { JobsRepository } from '@/repositories/jobs-repository'
import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { DisabilityType, Location } from '@prisma/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateJobUseCase } from './create-job'

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

    prisma.job.create.mockResolvedValueOnce(newJob)

    const { job } = await sut.execute({
      companyId: newJob.company_id,
      ...newJob,
    })

    expect(job).toStrictEqual(newJob)
  })
})
