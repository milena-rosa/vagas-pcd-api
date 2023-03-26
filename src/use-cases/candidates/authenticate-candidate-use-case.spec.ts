import { CandidatesRepository } from '@/repositories/candidates-repository'
import { InMemoryCandidatesRepository } from '@/repositories/in-memory/in-memory-candidates-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { AuthenticateCandidateUseCase } from './authenticate-candidate-use-case'

let candidatesRepository: CandidatesRepository
let sut: AuthenticateCandidateUseCase

describe('authenticate candidate use case', () => {
  beforeEach(() => {
    candidatesRepository = new InMemoryCandidatesRepository()
    sut = new AuthenticateCandidateUseCase(candidatesRepository)
  })

  it('should be able to authenticate a candidate', async () => {
    const email = 'janedoe@example.com'
    await candidatesRepository.create({
      name: 'Jane Doe',
      email,
      password_hash: await hash('123456', 6),
      phone: null,
      resume: 'linkedin',
    })

    const { candidate } = await sut.execute({
      email,
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
    const email = 'janedoe@example.com'
    await candidatesRepository.create({
      name: 'Jane Doe',
      email,
      password_hash: await hash('123456', 6),
      phone: null,
      resume: 'linkedin',
    })

    await expect(() =>
      sut.execute({
        email,
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
