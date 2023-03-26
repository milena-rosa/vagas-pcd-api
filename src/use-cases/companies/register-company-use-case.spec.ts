import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { CNPJAlreadyRegisteredError } from '../errors/cnpj-already-registered-error'
import { EmailAlreadyRegisteredError } from '../errors/email-already-registered-error'
import { RegisterCompanyUseCase } from './register-company-use-case'

// let companiesRepository: CompaniesRepository
let sut: RegisterCompanyUseCase

describe.skip('register company use case', () => {
  beforeEach(() => {
    // companiesRepository = new InMemoryCompaniesRepository()
    // sut = new RegisterCompanyUseCase(companiesRepository)
  })

  it('should be able to register a company', async () => {
    const email = 'janedoe@example.com'
    const { company } = await sut.execute({
      email,
      password: '123456',
      cnpj: '23.243.199/0001-84',
    })

    expect(company.id).toEqual(expect.any(String))
  })

  it('should hash user password on registry', async () => {
    const email = 'janedoe@example.com'
    const { company } = await sut.execute({
      email,
      password: '123456',
      cnpj: '23.243.199/0001-84',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      company.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register a company with an email twice', async () => {
    const email = 'janedoe@example.com'
    await sut.execute({
      email,
      password: '123456',
      cnpj: '23.243.199/0001-84',
    })

    await expect(() =>
      sut.execute({
        email,
        password: '123456',
        cnpj: '23.243.199/0001-84',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyRegisteredError)
  })

  it('should not be able to register a company with a cnpj twice', async () => {
    const cnpj = '23.243.199/0001-84'
    await sut.execute({
      email: 'janedoe@example.com',
      password: '123456',
      cnpj,
    })

    await expect(() =>
      sut.execute({
        email: 'janedoe2@example.com',
        password: '123456',
        cnpj,
      }),
    ).rejects.toBeInstanceOf(CNPJAlreadyRegisteredError)
  })
})
