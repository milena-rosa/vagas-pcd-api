import { CandidatesRepository } from '@/repositories/candidates-repository'
import { InMemoryCandidatesRepository } from '@/repositories/in-memory/in-memory-candidates-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { GetCandidateProfileUseCase } from './get-candidate-profile-use-case'

let candidatesRepository: CandidatesRepository
let sut: GetCandidateProfileUseCase

describe('get candidate profile use case', () => {
  beforeEach(() => {
    candidatesRepository = new InMemoryCandidatesRepository()
    sut = new GetCandidateProfileUseCase(candidatesRepository)
  })

  it('should be able to get a candidate profile', async () => {
    const createdCandidate = await candidatesRepository.create({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password_hash: await hash('123456', 6),
      phone: null,
      resume: 'linkedin',
    })

    const { candidate } = await sut.execute({
      candidateId: createdCandidate.id,
    })

    expect(candidate.id).toEqual(expect.any(String))
    expect(candidate.name).toEqual('Jane Doe')
  })

  it('should not be able to get a candidate profile with a wrong id', async () => {
    await expect(() =>
      sut.execute({
        candidateId: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
