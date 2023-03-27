import { prisma } from '@/libs/__mocks__/prisma'
import { CandidatesRepository } from '@/repositories/candidates-repository'
import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { getNewCandidate } from '@/utils/tests/get-new-candidate'
import { Candidate } from '@prisma/client'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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
    const newCandidate: Candidate = await getNewCandidate()
    prisma.candidate.update.mockResolvedValue({
      ...newCandidate,
      name: 'Joana',
    })
    prisma.candidate.findUnique.mockResolvedValue(newCandidate)

    const { candidate } = await sut.execute({
      id: newCandidate.id,
      name: 'Joana',
    })

    expect(candidate.id).toEqual(expect.any(String))
    expect(candidate.name).toEqual('Joana')
  })

  it('should be able to update the password of a candidate given an correct id', async () => {
    const newCandidate: Candidate = await getNewCandidate()
    const newPasswordHash = await hash('654321', 6)

    prisma.candidate.findUnique.mockResolvedValueOnce(newCandidate)
    prisma.candidate.update.mockResolvedValueOnce({
      ...newCandidate,
      password_hash: newPasswordHash,
    })

    const { candidate } = await sut.execute({
      id: newCandidate.id,
      password: '654321',
    })

    expect(candidate.id).toEqual(expect.any(String))
    expect(candidate.password_hash).toEqual(newPasswordHash)
  })

  it('should not be able to update the name of a candidate given an correct id if the name is undefined', async () => {
    const newCandidate: Candidate = await getNewCandidate()
    prisma.candidate.update.mockResolvedValue(newCandidate)
    prisma.candidate.findUnique.mockResolvedValue(newCandidate)

    const { candidate } = await sut.execute({
      id: newCandidate.id,
    })

    expect(candidate.id).toEqual(expect.any(String))
    expect(candidate.name).toEqual(newCandidate.name)
  })

  it('should not be able to update the name of a candidate given an incorrect id', async () => {
    prisma.candidate.create.mockRejectedValueOnce(new ResourceNotFoundError())

    await expect(() =>
      sut.execute({
        id: 'non-existent-id',
        name: 'Joana',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
