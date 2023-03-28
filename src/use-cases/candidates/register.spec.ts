import { prisma } from '@/libs/__mocks__/prisma'
import { CandidatesRepository } from '@/repositories/candidates-repository'
import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { Candidate } from '@prisma/client'
import { compare, hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EmailAlreadyRegisteredError } from '../errors/email-already-registered-error'
import { RegisterCandidateUseCase } from './register'

let candidatesRepository: CandidatesRepository
let sut: RegisterCandidateUseCase

vi.mock('@/libs/prisma')

describe('register candidate use case', () => {
  beforeEach(() => {
    candidatesRepository = new PrismaCandidatesRepository()
    sut = new RegisterCandidateUseCase(candidatesRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to register a candidate', async () => {
    const newCandidate: Candidate = {
      id: '123',
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      phone: null,
      password_hash: await hash('123456', 6),
      resume: 'https://linkedin.com/in/milena-rosa',
      created_at: new Date(),
    }

    prisma.candidate.create.mockResolvedValueOnce(newCandidate)

    const { candidate } = await sut.execute({
      email: newCandidate.email,
      name: newCandidate.name,
      password: '123456',
      phone: newCandidate.phone,
      resume: newCandidate.resume,
    })

    expect(candidate).toStrictEqual(newCandidate)
  })

  it('should hash candidate password on registry', async () => {
    const newCandidate: Candidate = {
      id: '123',
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      phone: null,
      password_hash: await hash('123456', 6),
      resume: 'https://linkedin.com/in/milena-rosa',
      created_at: new Date(),
    }

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
    const newCandidate: Candidate = {
      id: '123',
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      phone: null,
      password_hash: await hash('123456', 6),
      resume: 'https://linkedin.com/in/milena-rosa',
      created_at: new Date(),
    }

    prisma.candidate.findUnique.mockImplementationOnce(() => {
      throw new EmailAlreadyRegisteredError()
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
