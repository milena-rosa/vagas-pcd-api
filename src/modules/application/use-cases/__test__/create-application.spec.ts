import { JobClosedError } from '@/errors/job-closed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/libs/__mocks__/prisma'
import { ApplicationsRepository } from '@/repositories/applications-repository'
import { CandidateUser } from '@/repositories/candidates-repository'
import { JobsRepository } from '@/repositories/jobs-repository'
import { PrismaApplicationsRepository } from '@/repositories/prisma/prisma-applications-repository'
import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { DisabilityType, Location, User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateApplicationUseCase } from '../create-application'

let applicationsRepository: ApplicationsRepository
let jobsRepository: JobsRepository
let sut: CreateApplicationUseCase

vi.mock('@/libs/prisma')

describe('apply for job use case', () => {
  beforeEach(() => {
    applicationsRepository = new PrismaApplicationsRepository()
    jobsRepository = new PrismaJobsRepository()
    sut = new CreateApplicationUseCase(applicationsRepository, jobsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should be able to apply for a job', async () => {
    const mockUser: User = {
      user_id: randomUUID(),
      email: 'janedoe@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCandidate: CandidateUser = {
      candidate_id: mockUser.user_id,
      name: 'Jane Doe',
      phone: '11999222333',
      zipCode: '45007-605',
      street: 'Rua Padre Gilberto Vaz Sampaio',
      number: '933',
      complement: '',
      neighborhood: 'Lagoa das Flores',
      city: 'Vitória da Conquista',
      state: 'BA',
      linkedin: 'https://linkedin.com/in/jane-doe',
      professionalExperience: '',
      educationalBackground: '',
      skills: '',
      user: mockUser,
    }

    const mockJob = {
      job_id: randomUUID(),
      company_id: '123',
      title: 'Engenheiro(a) de software',
      description: 'Vaga massinha com uma descrição legal.',
      role: 'Analista',
      linkedin: 'https://www.linkedin.com/jobs/view/3580802802',
      perks:
        '- Vale alimentação: R$ 500,00;\n - Vale refeição: R$ 1000,00;\n- Plano de saúde;\n-Gympass.',
      disability_type: DisabilityType.ANY,
      location: Location.ON_SITE,
      salary: 10000,
      created_at: new Date(),
      closed_at: null,
    }

    const mockApplication = {
      id: randomUUID(),
      candidate_id: mockCandidate.candidate_id,
      job_id: mockJob.job_id,
      created_at: new Date(),
    }

    prisma.job.findUnique.mockResolvedValueOnce(mockJob)
    prisma.application.create.mockResolvedValueOnce(mockApplication)

    const { application } = await sut.execute({
      candidate_id: mockCandidate.candidate_id,
      job_id: mockJob.job_id,
    })

    expect(prisma.application.create).toHaveBeenCalledOnce()
    expect(application).toStrictEqual(mockApplication)
  })

  it('should not be able to apply for a job with wrong job id', async () => {
    await expect(() =>
      sut.execute({
        candidate_id: randomUUID(),
        job_id: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to apply for a closed job', async () => {
    vi.setSystemTime(new Date(2023, 2, 1))

    const mockJob = {
      job_id: randomUUID(),
      company_id: '123',
      title: 'Engenheiro(a) de software',
      description: 'Vaga massinha com uma descrição legal.',
      role: 'Analista',
      linkedin: 'https://www.linkedin.com/jobs/view/3580802802',
      perks:
        '- Vale alimentação: R$ 500,00;\n - Vale refeição: R$ 1000,00;\n- Plano de saúde;\n-Gympass.',
      disability_type: DisabilityType.ANY,
      location: Location.ON_SITE,
      salary: 10000,
      created_at: new Date(),
      closed_at: new Date(2023, 3, 1),
    }

    prisma.job.findUnique.mockResolvedValueOnce(mockJob)

    await expect(() =>
      sut.execute({
        candidate_id: '123',
        job_id: mockJob.job_id,
      }),
    ).rejects.toBeInstanceOf(JobClosedError)
  })
})
