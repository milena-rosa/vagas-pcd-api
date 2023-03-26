import { prisma } from '@/libs/__mocks__/prisma'
import { CandidatesRepository } from '@/repositories/candidates-repository'
import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { getNewCandidate } from '@/utils/tests/get-new-candidate'
import { Candidate } from '@prisma/client'
import { compare } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EmailAlreadyRegisteredError } from '../errors/email-already-registered-error'
import { RegisterCandidateUseCase } from './register-candidate-use-case'

let candidatesRepository: CandidatesRepository
let sut: RegisterCandidateUseCase

describe('register candidate use case', () => {
  vi.mock('@/libs/prisma')

  beforeEach(() => {
    candidatesRepository = new PrismaCandidatesRepository()
    sut = new RegisterCandidateUseCase(candidatesRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to register a candidate', async () => {
    const newCandidate: Candidate = await getNewCandidate()
    prisma.candidate.create.mockResolvedValue(newCandidate)

    const { candidate } = await sut.execute({
      email: newCandidate.email,
      name: newCandidate.name,
      password: '123456',
      phone: newCandidate.phone,
      resume: newCandidate.resume,
    })
    expect(candidate.id).toEqual(expect.any(String))
    expect(candidate.name).toEqual(newCandidate.name)
  })

  it('should hash candidate password on registry', async () => {
    const newCandidate: Candidate = await getNewCandidate()
    prisma.candidate.create.mockResolvedValueOnce(newCandidate)

    const { candidate } = await sut.execute({
      email: newCandidate.email,
      name: newCandidate.name,
      password: '123456',
      phone: newCandidate.phone,
      resume: newCandidate.resume,
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      candidate.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with an email twice', async () => {
    const newCandidate: Candidate = await getNewCandidate()

    prisma.candidate.create
      .mockResolvedValueOnce(newCandidate)
      .mockRejectedValueOnce(new EmailAlreadyRegisteredError())

    await sut.execute({
      email: newCandidate.email,
      name: newCandidate.name,
      password: '123456',
      phone: newCandidate.phone,
      resume: newCandidate.resume,
    })

    await expect(() =>
      sut.execute({
        email: newCandidate.email,
        name: newCandidate.name,
        password: '123456',
        phone: newCandidate.phone,
        resume: newCandidate.resume,
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyRegisteredError)
  })
})
