import { prisma } from '@/libs/__mocks__/prisma'
import { ApplicationsRepository } from '@/repositories/applications-repository'
import { PrismaApplicationsRepository } from '@/repositories/prisma/prisma-applications-repository'
import { DisabilityType, Location } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FetchCandidateApplicationsHistoryUseCase } from '../fetch-candidate-applications-history'

let applicationsRepository: ApplicationsRepository
let sut: FetchCandidateApplicationsHistoryUseCase

vi.mock('@/libs/prisma')

describe('fetch candidate applications history use case', () => {
  beforeEach(() => {
    applicationsRepository = new PrismaApplicationsRepository()
    sut = new FetchCandidateApplicationsHistoryUseCase(applicationsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should be able to fetch the candidate applications history', async () => {
    vi.setSystemTime(new Date(2023, 2, 1))

    const mockCompanyUser = {
      user_id: randomUUID(),
      email: 'lojasponei@example.com',
      role: 'COMPANY',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCompany = {
      company_id: mockCompanyUser.user_id,
      cnpj: '23.243.199/0001-84',
      name: 'Lojas Pônei',
      city: 'Poneilandia',
      state: 'SP',
      street: 'Rua dos Bobos',
      number: '0',
      phone: '11999222333',
      zipCode: '13636085',
      complement: '',
      user: mockCompanyUser,
    }

    const mockCandidateUser = {
      user_id: randomUUID(),
      email: 'janedoe@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockJob = {
      company_id: mockCompanyUser.user_id,
      company: mockCompany,
      title: 'Engenheiro(a) de software',
      description: 'Vaga massinha com uma descrição legal.',
      role: 'Analista',
      disability_type: DisabilityType.ANY,
      location: Location.ON_SITE,
      salary: 10000,
      closed_at: null,
    }

    const mockJobs = []
    for (let i = 1; i <= 3; i++) {
      mockJobs.push({
        ...mockJob,
        job_id: randomUUID(),
        created_at: new Date(),
      })
    }

    const mockApplication = {
      candidate_id: mockCandidateUser.user_id,
      job: mockJob,
      created_at: new Date(),
    }

    const mockApplications = []
    for (let i = 1; i <= 3; i++) {
      mockApplications.push({
        ...mockApplication,
        id: randomUUID(),
        job_id: mockJobs[i - 1].job_id,
      })
    }

    prisma.application.findMany.mockResolvedValueOnce(mockApplications)

    const { jobs } = await sut.execute({
      candidate_id: mockCandidateUser.user_id,
    })

    expect(jobs).toHaveLength(3)
    expect(jobs).toEqual([
      expect.objectContaining({ application_id: mockApplications[0].id }),
      expect.objectContaining({ application_id: mockApplications[1].id }),
      expect.objectContaining({ application_id: mockApplications[2].id }),
    ])
  })

  it('should be able to fetch paginated candidate applications history', async () => {
    vi.setSystemTime(new Date(2023, 2, 1))

    const mockCompanyUser = {
      user_id: randomUUID(),
      email: 'lojasponei@example.com',
      role: 'COMPANY',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCompany = {
      company_id: mockCompanyUser.user_id,
      cnpj: '23.243.199/0001-84',
      name: 'Lojas Pônei',
      city: 'Poneilandia',
      state: 'SP',
      street: 'Rua dos Bobos',
      number: '0',
      phone: '11999222333',
      zipCode: '13636085',
      complement: '',
      user: mockCompanyUser,
    }

    const mockCandidateUser = {
      user_id: randomUUID(),
      email: 'janedoe@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockJob = {
      company_id: mockCompanyUser.user_id,
      company: mockCompany,
      title: 'Engenheiro(a) de software',
      description: 'Vaga massinha com uma descrição legal.',
      role: 'Analista',
      disability_type: DisabilityType.ANY,
      location: Location.ON_SITE,
      salary: 10000,
      closed_at: null,
    }

    const mockJobs = []
    for (let i = 1; i <= 2; i++) {
      mockJobs.push({
        ...mockJob,
        job_id: randomUUID(),
        created_at: new Date(),
      })
    }

    const mockApplication = {
      candidate_id: mockCandidateUser.user_id,
      job: mockJob,
      created_at: new Date(),
    }

    const mockApplications = []
    for (let i = 21; i <= 22; i++) {
      mockApplications.push({
        ...mockApplication,
        id: randomUUID(),
        job_id: mockJobs[i - 21].job_id,
      })
    }

    prisma.application.findMany.mockResolvedValueOnce(mockApplications)

    const { jobs, page } = await sut.execute({
      candidate_id: mockCandidateUser.user_id,
      page: 2,
    })

    expect(page).toEqual(2)
    expect(jobs).toHaveLength(2)
    expect(jobs).toEqual([
      expect.objectContaining({ application_id: mockApplications[0].id }),
      expect.objectContaining({ application_id: mockApplications[1].id }),
    ])
  })
})
