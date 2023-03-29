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
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { GetCandidateProfileUseCase } from './get-profile'

let candidatesRepository: CandidatesRepository
let sut: GetCandidateProfileUseCase

vi.mock('@/libs/prisma')

describe('get candidate profile use case', () => {
  beforeEach(() => {
    candidatesRepository = new PrismaCandidatesRepository()
    sut = new GetCandidateProfileUseCase(candidatesRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to get a candidate profile', async () => {
    const mockUser: User = {
      user_id: randomUUID(),
      email: 'janedoe@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCandidate: CandidateUser = {
      id: randomUUID(),
      name: 'Jane Doe',
      phone: null,
      resume: 'https://linkedin.com/in/milena-rosa',
      user_id: mockUser.user_id,
      user: mockUser,
    }

    prisma.candidate.findFirst.mockResolvedValueOnce(mockCandidate)

    const { candidate } = await sut.execute({
      userId: mockUser.user_id,
    })

    expect(candidate).toStrictEqual(mockCandidate)
  })

  it('should not be able to get a candidate profile with a wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
