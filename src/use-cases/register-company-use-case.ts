import { AddressesRepository } from '@/repositories/addresses-repository'
import { CompaniesRepository } from '@/repositories/companies-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { Company } from '@prisma/client'
import { hash } from 'bcryptjs'
import { EmailAlreadyRegisteredError } from './errors/email-already-registered-error'

interface RegisterCompanyUseCaseRequest {
  cnpj: string
  name: string
  email: string
  password: string
  phone: string | null
  street: string
  number: string
  city: string
  state: string
  zipCode: string
  complement: string | null
}

interface RegisterCompanyUseCaseResponse {
  company: Company
}

export class RegisterCompanyUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private companiesRepository: CompaniesRepository,
    private addressesRepository: AddressesRepository,
  ) {}

  async execute({
    cnpj,
    email,
    name,
    password,
    phone,
    street,
    number,
    city,
    state,
    zipCode,
    complement,
  }: RegisterCompanyUseCaseRequest): Promise<RegisterCompanyUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new EmailAlreadyRegisteredError()
    }

    const password_hash = await hash(password, 6)

    const user = await this.usersRepository.create({
      email,
      name,
      password_hash,
      phone,
    })

    const company = await this.companiesRepository.create({
      user_id: user.id,
      cnpj,
    })

    await this.addressesRepository.create({
      company_id: company.id,
      street,
      number,
      city,
      state,
      zipCode,
      complement,
    })

    return { company }
  }
}
