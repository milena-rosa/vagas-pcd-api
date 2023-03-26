import { CandidatesRepository } from '@/repositories/candidates-repository'
import { InMemoryCandidatesRepository } from '@/repositories/in-memory/in-memory-candidates-repository'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { EmailAlreadyRegisteredError } from './errors/email-already-registered-error'
import { RegisterCandidateUseCase } from './register-candidate-use-case'

let candidatesRepository: CandidatesRepository
let sut: RegisterCandidateUseCase

describe('register candidate use case', () => {
  beforeEach(() => {
    candidatesRepository = new InMemoryCandidatesRepository()
    sut = new RegisterCandidateUseCase(candidatesRepository)
  })

  it('should be able to register a candidate', async () => {
    const email = 'janedoe@example.com'
    const { candidate } = await sut.execute({
      name: 'Jane Doe',
      email,
      password: '123456',
      phone: null,
      resume: 'linkedin',
    })

    expect(candidate.id).toEqual(expect.any(String))
  })

  it('should hash candidate password on registry', async () => {
    const email = 'janedoe@example.com'
    const { candidate } = await sut.execute({
      name: 'Jane Doe',
      email,
      password: '123456',
      phone: null,
      resume: 'linkedin',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      candidate.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with an email twice', async () => {
    const email = 'janedoe@example.com'
    await sut.execute({
      name: 'Jane Doe',
      email,
      password: '123456',
      phone: null,
      resume: 'linkedin',
    })

    await expect(() =>
      sut.execute({
        name: 'Jane Doe',
        email,
        password: '123456',
        phone: null,
        resume: 'linkedin',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyRegisteredError)
  })
})
