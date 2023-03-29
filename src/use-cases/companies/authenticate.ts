import { CompaniesRepository } from '@/repositories/companies-repository'
import { Company } from '@prisma/client'
import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

interface AuthenticateCompanyUseCaseRequest {
  emailOrCnpj: string
  password: string
}

interface AuthenticateCompanyUseCaseResponse {
  company: Company
}

export class AuthenticateCompanyUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute({
    emailOrCnpj,
    password,
  }: AuthenticateCompanyUseCaseRequest): Promise<AuthenticateCompanyUseCaseResponse> {
    const foundCompanyByEmail = await this.companiesRepository.findByEmail(
      emailOrCnpj,
    )
    const foundCompanyByCNPJ = await this.companiesRepository.findByCNPJ(
      emailOrCnpj,
    )

    const foundCompany = foundCompanyByCNPJ || foundCompanyByEmail
    if (!foundCompany) {
      throw new InvalidCredentialsError()
    }

    const doPasswordsMatch = await compare(password, foundCompany.password_hash)
    if (!doPasswordsMatch) {
      throw new InvalidCredentialsError()
    }

    return { company: foundCompany }
  }
}
