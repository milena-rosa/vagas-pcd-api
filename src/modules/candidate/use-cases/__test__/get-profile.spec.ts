import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/libs/__mocks__/prisma'
import { CandidatesRepository } from '@/repositories/candidates-repository'
import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GetCandidateProfileUseCase } from '../get-profile'

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
    const mockUser = {
      user_id: randomUUID(),
      email: 'janedoe@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCandidate = {
      candidate_id: mockUser.user_id,
      name: 'Jane Doe',
      phone: null,
      resume: 'https://linkedin.com/in/jane-doe',
      user: mockUser,
    }

    prisma.candidate.findUnique.mockResolvedValueOnce(mockCandidate)

    const { candidate } = await sut.execute({
      candidate_id: mockCandidate.candidate_id,
    })

    expect(candidate).toStrictEqual({
      candidate_id: mockCandidate.candidate_id,
      name: mockCandidate.name,
      phone: mockCandidate.phone,
      resume: mockCandidate.resume,
      email: mockCandidate.user.email,
      created_at: mockCandidate.user.created_at,
      password_hash: mockCandidate.user.password_hash,
    })
  })

  it('should not be able to get a candidate profile with a wrong id', async () => {
    await expect(() =>
      sut.execute({
        candidate_id: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
