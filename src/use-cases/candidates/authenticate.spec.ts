import { prisma } from '@/libs/__mocks__/prisma'
import { CandidatesRepository } from '@/repositories/candidates-repository'
import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { Candidate } from '@prisma/client'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { AuthenticateCandidateUseCase } from './authenticate'

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

  // TODO: test jwt
  it('should be able to authenticate a candidate', async () => {
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

    await expect(() =>
      sut.execute({
        email: newCandidate.email,
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
