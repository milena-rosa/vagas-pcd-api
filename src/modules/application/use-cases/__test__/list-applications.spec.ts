import { prisma } from '@/libs/__mocks__/prisma'
import {
  CandidateUser,
  CandidatesRepository,
} from '@/repositories/candidates-repository'
import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ListApplicationsUseCase } from '../list-applications'

let candidatesRepository: CandidatesRepository
let sut: ListApplicationsUseCase

vi.mock('@/libs/prisma')

describe('fetch job candidates use case', () => {
  beforeEach(() => {
    candidatesRepository = new PrismaCandidatesRepository()
    sut = new ListApplicationsUseCase(candidatesRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should be able to fetch the candidates of a job', async () => {
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

    prisma.candidate.findMany.mockResolvedValue([
      mockCandidate1,
      mockCandidate2,
      mockCandidate3,
    ])

    const { candidates } = await sut.execute({ job_id: '123' })

    expect(candidates).toHaveLength(3)
  })

  it('should be able to fetch paginated candidates of a job', async () => {
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

    prisma.candidate.findMany.mockResolvedValue([
      mockCandidate1,
      mockCandidate2,
      mockCandidate3,
    ])

    const { candidates } = await sut.execute({
      job_id: '123',
      page: 2,
    })

    expect(candidates).toHaveLength(3)
  })
})
