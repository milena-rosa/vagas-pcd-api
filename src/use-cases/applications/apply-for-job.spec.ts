import { prisma } from '@/libs/__mocks__/prisma'
import { ApplicationsRepository } from '@/repositories/applications-repository'
import { JobsRepository } from '@/repositories/jobs-repository'
import { PrismaApplicationsRepository } from '@/repositories/prisma/prisma-applications-repository'
import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { DisabilityType, Location } from '@prisma/client'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { JobClosedError } from '../errors/job-closed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { ApplyForJobUseCase } from './apply-for-job'

let applicationsRepository: ApplicationsRepository
let jobsRepository: JobsRepository
let sut: ApplyForJobUseCase

vi.mock('@/libs/prisma')

describe('apply for job use case', () => {
  beforeEach(() => {
    applicationsRepository = new PrismaApplicationsRepository()
    jobsRepository = new PrismaJobsRepository()
    sut = new ApplyForJobUseCase(applicationsRepository, jobsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should be able to apply for a job', async () => {
    const mockCandidate = {
      id: '123',
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      phone: null,
      password_hash: await hash('123456', 6),
      resume: 'https://linkedin.com/in/milena-rosa',
      created_at: new Date(),
    }

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

    const mockApplication = {
      id: '123',
      candidate_id: mockCandidate.id,
      job_id: mockJob.id,
      created_at: new Date(),
    }

    prisma.job.findUnique.mockResolvedValueOnce(mockJob)
    prisma.application.create.mockResolvedValueOnce(mockApplication)

    const { application } = await sut.execute({
      candidateId: mockCandidate.id,
      jobId: mockJob.id,
    })

    expect(prisma.application.create).toHaveBeenCalledOnce()
    expect(application).toStrictEqual(application)
  })

  it('should not be able to apply job wrong job id', async () => {
    await expect(() =>
      sut.execute({
        candidateId: '123',
        jobId: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to apply for a closed job', async () => {
    vi.setSystemTime(new Date(2023, 2, 1))

    const mockCandidate = {
      id: '123',
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      phone: null,
      password_hash: await hash('123456', 6),
      resume: 'https://linkedin.com/in/milena-rosa',
      created_at: new Date(),
    }

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
      closed_at: new Date(2023, 3, 1),
    }

    prisma.job.findUnique.mockResolvedValueOnce(mockJob)

    await expect(() =>
      sut.execute({
        candidateId: mockCandidate.id,
        jobId: mockJob.id,
      }),
    ).rejects.toBeInstanceOf(JobClosedError)
  })
})
