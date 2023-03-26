import { CandidatesRepository } from '@/repositories/candidates-repository'
import { InMemoryCandidatesRepository } from '@/repositories/in-memory/in-memory-candidates-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { EmailAlreadyRegisteredError } from './errors/email-already-registered-error'
import { RegisterCandidateUseCase } from './register-candidate-use-case'

let usersRepository: UsersRepository
let candidatesRepository: CandidatesRepository
let sut: RegisterCandidateUseCase

describe('register candidate use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    candidatesRepository = new InMemoryCandidatesRepository()
    sut = new RegisterCandidateUseCase(usersRepository, candidatesRepository)
  })

  it('should be able to register', async () => {
    const email = 'janedoe@example.com'
    const { candidate } = await sut.execute({
      name: 'Jane Doe',
      email,
      password: '123456',
      phone: null,
      resume: 'linkedin',
    })

    const foundUser = await usersRepository.findByEmail(email)

    expect(candidate.id).toEqual(expect.any(String))
    expect(foundUser?.id).toEqual(candidate.user_id)
  })

  it('should hash user password on registry', async () => {
    const email = 'janedoe@example.com'
    await sut.execute({
      name: 'Jane Doe',
      email,
      password: '123456',
      phone: null,
      resume: 'linkedin',
    })

    const foundUser = await usersRepository.findByEmail(email)
    expect(foundUser).toBeTruthy()

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      foundUser!.password_hash,
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

    const foundUser = await usersRepository.findByEmail(email)
    expect(foundUser).toBeTruthy()

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      foundUser!.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
