import { prisma } from '@/libs/__mocks__/prisma'
import { CandidatesRepository } from '@/repositories/candidates-repository'
import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { getNewCandidate } from '@/utils/tests/get-new-candidate'
import { Candidate } from '@prisma/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { GetCandidateProfileUseCase } from './get-candidate-profile-use-case'

let candidatesRepository: CandidatesRepository
let sut: GetCandidateProfileUseCase

describe('get candidate profile use case', () => {
  vi.mock('@/libs/prisma')

  beforeEach(() => {
    candidatesRepository = new PrismaCandidatesRepository()
    sut = new GetCandidateProfileUseCase(candidatesRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to get a candidate profile', async () => {
    const newCandidate: Candidate = await getNewCandidate()

    prisma.candidate.findUnique.mockResolvedValue(newCandidate)

    const { candidate } = await sut.execute({
      candidateId: newCandidate.id,
    })

    expect(candidate.id).toEqual(expect.any(String))
    expect(candidate.name).toEqual(newCandidate.name)
  })

  it('should not be able to get a candidate profile with a wrong id', async () => {
    await expect(() =>
      sut.execute({
        candidateId: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
