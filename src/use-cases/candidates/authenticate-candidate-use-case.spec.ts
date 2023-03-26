import { prisma } from '@/libs/__mocks__/prisma'
import { CandidatesRepository } from '@/repositories/candidates-repository'
import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { getNewCandidate } from '@/utils/tests/get-new-candidate'
import { Candidate } from '@prisma/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { AuthenticateCandidateUseCase } from './authenticate-candidate-use-case'

let candidatesRepository: CandidatesRepository
let sut: AuthenticateCandidateUseCase

vi.mock('@/libs/prisma')

describe('authenticate candidate use case', () => {
  beforeEach(() => {
    candidatesRepository = new PrismaCandidatesRepository()
    sut = new AuthenticateCandidateUseCase(candidatesRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to authenticate a candidate', async () => {
    const newCandidate: Candidate = await getNewCandidate()

    prisma.candidate.findUnique.mockResolvedValue(newCandidate)

    const { candidate } = await sut.execute({
      email: newCandidate.email,
      password: '123456',
    })

    expect(candidate.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with a wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'janedoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with a wrong password', async () => {
    const newCandidate: Candidate = await getNewCandidate()

    prisma.candidate.findUnique.mockResolvedValue(newCandidate)

    await expect(() =>
      sut.execute({
        email: newCandidate.email,
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
