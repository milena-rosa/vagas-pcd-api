import { AddressesRepository } from '@/repositories/addresses-repository'
import { CompaniesRepository } from '@/repositories/companies-repository'
import { InMemoryAddressesRepository } from '@/repositories/in-memory/in-memory-addresses-repository'
import { InMemoryCompaniesRepository } from '@/repositories/in-memory/in-memory-companies-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { EmailAlreadyRegisteredError } from './errors/email-already-registered-error'
import { RegisterCompanyUseCase } from './register-company-use-case'

let usersRepository: UsersRepository
let companiesRepository: CompaniesRepository
let addressesRepository: AddressesRepository
let sut: RegisterCompanyUseCase
const email = 'janedoe@example.com'
const newCompany = {
  name: 'Jane Doe',
  email,
  password: '123456',
  phone: null,
  cnpj: '23.243.199/0001-84',
  zipCode: '04617902',
  street: 'Rua Vieira de Morais',
  number: '1900',
  city: 'São Paulo',
  state: 'SP',
  complement: null,
}

describe('register company use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    companiesRepository = new InMemoryCompaniesRepository()
    addressesRepository = new InMemoryAddressesRepository()
    sut = new RegisterCompanyUseCase(
      usersRepository,
      companiesRepository,
      addressesRepository,
    )
  })

  it('should be able to register company', async () => {
    const { company } = await sut.execute(newCompany)

    const foundUser = await usersRepository.findByEmail(email)
    const foundAddress = await addressesRepository.findByCompanyId(company.id)

    expect(company.id).toEqual(expect.any(String))
    expect(foundUser?.id).toEqual(company.user_id)
    expect(foundAddress?.company_id).toEqual(company.id)
  })

  it('should hash user password on registry', async () => {
    await sut.execute(newCompany)

    const foundUser = await usersRepository.findByEmail(email)
    expect(foundUser).toBeTruthy()

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      foundUser!.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with an email twice', async () => {
    await sut.execute(newCompany)

    await expect(() => sut.execute(newCompany)).rejects.toBeInstanceOf(
      EmailAlreadyRegisteredError,
    )

    const foundUser = await usersRepository.findByEmail(email)
    expect(foundUser).toBeTruthy()

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      foundUser!.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
