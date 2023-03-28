import { prisma } from '@/libs/__mocks__/prisma'
import { CandidatesRepository } from '@/repositories/candidates-repository'
import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { Candidate } from '@prisma/client'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { GetCandidateProfileUseCase } from './get-candidate-profile-use-case'

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
    const newCandidate: Candidate = {
      id: '123',
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      phone: null,
      password_hash: await hash('123456', 6),
      resume: 'https://linkedin.com/in/milena-rosa',
      created_at: new Date(),
    }

    prisma.candidate.findUnique.mockResolvedValueOnce(newCandidate)

    const { candidate } = await sut.execute({
      candidateId: newCandidate.id,
    })

    expect(candidate).toStrictEqual(newCandidate)
  })

  it('should not be able to get a candidate profile with a wrong id', async () => {
    await expect(() =>
      sut.execute({
        candidateId: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
