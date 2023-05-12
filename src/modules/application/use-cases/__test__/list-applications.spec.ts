import { prisma } from '@/libs/__mocks__/prisma'
import {
  ApplicationWithCandidate,
  ApplicationsRepository,
} from '@/repositories/applications-repository'
import { CandidateUser } from '@/repositories/candidates-repository'
import { JobsRepository } from '@/repositories/jobs-repository'
import { PrismaApplicationsRepository } from '@/repositories/prisma/prisma-applications-repository'
import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { DisabilityType, Location, User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ListApplicationsUseCase } from '../list-applications'

let applicationsRepository: ApplicationsRepository
let jobsRepository: JobsRepository
let sut: ListApplicationsUseCase

vi.mock('@/libs/prisma')

describe('fetch job candidates use case', () => {
  beforeEach(() => {
    applicationsRepository = new PrismaApplicationsRepository()
    jobsRepository = new PrismaJobsRepository()
    sut = new ListApplicationsUseCase(applicationsRepository, jobsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should be able to fetch the candidates of a job', async () => {
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

    prisma.job.findUnique.mockResolvedValueOnce(mockJob)

    const mockUser1: User = {
      user_id: randomUUID(),
      email: 'janedoe@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCandidate1: CandidateUser = {
      candidate_id: mockUser1.user_id,
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
      user: mockUser1,
    }

    const mockApplication1: ApplicationWithCandidate = {
      id: randomUUID(),
      candidate_id: mockCandidate1.candidate_id,
      job_id: mockJob.job_id,
      created_at: new Date(),
      candidate: mockCandidate1,
    }

    const mockUser2: User = {
      user_id: randomUUID(),
      email: 'janedoe2@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCandidate2: CandidateUser = {
      candidate_id: mockUser2.user_id,
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
      user: mockUser2,
    }

    const mockApplication2 = {
      id: randomUUID(),
      candidate_id: mockCandidate2.candidate_id,
      job_id: mockJob.job_id,
      created_at: new Date(),
      candidate: mockCandidate2,
    }

    const mockUser3: User = {
      user_id: randomUUID(),
      email: 'janedoe3@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCandidate3: CandidateUser = {
      candidate_id: mockUser3.user_id,
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
      user: mockUser3,
    }

    const mockApplication3 = {
      id: randomUUID(),
      candidate_id: mockCandidate3.candidate_id,
      job_id: mockJob.job_id,
      created_at: new Date(),
      candidate: mockCandidate3,
    }

    prisma.application.findMany.mockResolvedValue([
      mockApplication1,
      mockApplication2,
      mockApplication3,
    ])

    const { candidates } = await sut.execute({ job_id: mockJob.job_id })

    expect(candidates).toHaveLength(3)
  })

  it('should be able to fetch paginated candidates of a job', async () => {
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

    prisma.job.findUnique.mockResolvedValueOnce(mockJob)

    const mockUser1: User = {
      user_id: randomUUID(),
      email: 'janedoe@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCandidate1: CandidateUser = {
      candidate_id: mockUser1.user_id,
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
      user: mockUser1,
    }

    const mockApplication1: ApplicationWithCandidate = {
      id: randomUUID(),
      candidate_id: mockCandidate1.candidate_id,
      job_id: mockJob.job_id,
      created_at: new Date(),
      candidate: mockCandidate1,
    }

    const mockUser2: User = {
      user_id: randomUUID(),
      email: 'janedoe2@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCandidate2: CandidateUser = {
      candidate_id: mockUser2.user_id,
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
      user: mockUser2,
    }

    const mockApplication2 = {
      id: randomUUID(),
      candidate_id: mockCandidate2.candidate_id,
      job_id: mockJob.job_id,
      created_at: new Date(),
      candidate: mockCandidate2,
    }

    const mockUser3: User = {
      user_id: randomUUID(),
      email: 'janedoe3@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCandidate3: CandidateUser = {
      candidate_id: mockUser3.user_id,
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
      user: mockUser3,
    }

    const mockApplication3 = {
      id: randomUUID(),
      candidate_id: mockCandidate3.candidate_id,
      job_id: mockJob.job_id,
      created_at: new Date(),
      candidate: mockCandidate3,
    }

    prisma.application.findMany.mockResolvedValue([
      mockApplication1,
      mockApplication2,
      mockApplication3,
    ])

    const { candidates } = await sut.execute({
      job_id: mockJob.job_id,
      page: 2,
    })

    expect(candidates).toHaveLength(3)
  })
})
