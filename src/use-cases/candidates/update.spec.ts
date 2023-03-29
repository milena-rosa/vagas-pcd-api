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
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UpdateCandidateUseCase } from './update'

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
    const mockUser: User = {
      id: randomUUID(),
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
      user_id: mockUser.id,
      user: mockUser,
    }

    prisma.candidate.findUnique.mockResolvedValueOnce(mockCandidate)
    prisma.candidate.update.mockResolvedValueOnce({
      ...mockCandidate,
      name: 'Joana Doe',
    })

    const { candidate } = await sut.execute({
      id: mockCandidate.id,
      name: 'Joana Doe',
    })

    expect(candidate).toStrictEqual({ ...mockCandidate, name: 'Joana Doe' })
  })

  it('should not be able to change the password if the old password is not correct', async () => {
    const mockUser: User = {
      id: randomUUID(),
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
      user_id: mockUser.id,
      user: mockUser,
    }

    prisma.candidate.findUnique.mockResolvedValueOnce(mockCandidate)

    await expect(() =>
      sut.execute({
        id: mockCandidate.id,
        oldPassword: 'wrong-password',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to change the password if the old password is not sent', async () => {
    const mockUser: User = {
      id: randomUUID(),
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
      user_id: mockUser.id,
      user: mockUser,
    }

    prisma.candidate.findUnique.mockResolvedValueOnce(mockCandidate)

    await expect(() =>
      sut.execute({
        id: mockCandidate.id,
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be able to change the password given a correct id and the old password correctly', async () => {
    const mockUser: User = {
      id: randomUUID(),
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
      user_id: mockUser.id,
      user: mockUser,
    }

    const newPasswordHash = await hash('654321', 6)

    const mockUpdatedUser: User = {
      ...mockUser,
      password_hash: newPasswordHash,
    }

    prisma.candidate.findUnique.mockResolvedValueOnce(mockCandidate)
    prisma.user.update.mockResolvedValueOnce(mockUpdatedUser)
    prisma.candidate.update.mockResolvedValueOnce({
      ...mockCandidate,
      user_id: mockUpdatedUser.id,
    })

    const { candidate } = await sut.execute({
      id: mockCandidate.id,
      oldPassword: '123456',
      password: '654321',
    })

    expect(candidate).toStrictEqual({
      ...mockCandidate,
      user_id: mockUpdatedUser.id,
    })
  })

  it('should not be able to update the name of a candidate given a correct id if the name is undefined', async () => {
    const mockUser: User = {
      id: randomUUID(),
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
      user_id: mockUser.id,
      user: mockUser,
    }

    prisma.candidate.findUnique.mockResolvedValueOnce(mockCandidate)
    prisma.candidate.update.mockResolvedValueOnce(mockCandidate)

    const { candidate } = await sut.execute({
      id: mockCandidate.id,
      name: undefined,
    })

    expect(candidate).toStrictEqual(mockCandidate)
  })

  it('should not be able to update the name of a candidate given an incorrect id', async () => {
    prisma.candidate.update.mockRejectedValueOnce(new ResourceNotFoundError())

    await expect(() =>
      sut.execute({
        id: 'non-existent-id',
        name: 'Joana Doe',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
