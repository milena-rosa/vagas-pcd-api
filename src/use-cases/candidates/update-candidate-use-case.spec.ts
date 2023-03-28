import { prisma } from '@/libs/__mocks__/prisma'
import { CandidatesRepository } from '@/repositories/candidates-repository'
import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { Candidate } from '@prisma/client'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UpdateCandidateUseCase } from './update-candidate-use-case'

let candidatesRepository: CandidatesRepository
let sut: UpdateCandidateUseCase

vi.mock('@/libs/prisma')

describe('update candidate use case', () => {
  beforeEach(() => {
    candidatesRepository = new PrismaCandidatesRepository()
    sut = new UpdateCandidateUseCase(candidatesRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to update the name of a candidate given an correct id', async () => {
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
    prisma.candidate.update.mockResolvedValueOnce({
      ...newCandidate,
      name: 'Joana Doe',
    })

    const { candidate } = await sut.execute({
      id: newCandidate.id,
      name: 'Joana Doe',
    })

    expect(candidate).toStrictEqual({ ...newCandidate, name: 'Joana Doe' })
  })

  it('should not be able to change the password if the old password is not correct', async () => {
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
        id: newCandidate.id,
        oldPassword: 'wrong-password',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be able to change the password given a correct id and the old password correctly', async () => {
    const newCandidate: Candidate = {
      id: '123',
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      phone: null,
      password_hash: await hash('123456', 6),
      resume: 'https://linkedin.com/in/milena-rosa',
      created_at: new Date(),
    }
    const newPasswordHash = await hash('654321', 6)

    prisma.candidate.findUnique.mockResolvedValueOnce(newCandidate)
    prisma.candidate.update.mockResolvedValueOnce({
      ...newCandidate,
      password_hash: newPasswordHash,
    })

    const { candidate } = await sut.execute({
      id: newCandidate.id,
      oldPassword: '123456',
      password: '654321',
    })

    expect(candidate).toStrictEqual({
      ...newCandidate,
      password_hash: newPasswordHash,
    })
  })

  it('should not be able to update the name of a candidate given a correct id if the name is undefined', async () => {
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
    prisma.candidate.update.mockResolvedValueOnce(newCandidate)

    const { candidate } = await sut.execute({
      id: newCandidate.id,
      name: undefined,
    })

    expect(candidate).toStrictEqual(newCandidate)
  })

  it('should not be able to update the name of a candidate given an incorrect id', async () => {
    prisma.candidate.update.mockRejectedValueOnce(new ResourceNotFoundError())

    await expect(() =>
      sut.execute({
        id: 'non-existent-id',
        name: 'JoanaDoe',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
