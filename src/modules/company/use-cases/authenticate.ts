import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { CompaniesRepository } from '@/repositories/companies-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { compare } from 'bcryptjs'
import {
  AuthenticateCompanyRequest,
  CompanyProfileReply,
} from '../company.schema'

export class AuthenticateCompanyUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private companiesRepository: CompaniesRepository,
  ) {}

  async execute({ email, password }: AuthenticateCompanyRequest): Promise<{
    company: CompanyProfileReply
  }> {
    const foundUser = await this.usersRepository.findByEmail(email)
    if (!foundUser) {
      throw new InvalidCredentialsError()
    }
    const doPasswordsMatch = await compare(password, foundUser.password_hash)
    if (!doPasswordsMatch) {
      throw new InvalidCredentialsError()
    }

    const foundCompany = await this.companiesRepository.findById(
      foundUser.user_id,
    )
    if (!foundCompany) {
      throw new ResourceNotFoundError()
    }

    return {
      company: {
        company_id: foundCompany.company_id,
        cnpj: foundCompany.cnpj,
        name: foundCompany.name ?? '',
        email: foundCompany.user.email,
        phone: foundCompany.phone ?? '',
        street: foundCompany.street ?? '',
        number: foundCompany.number ?? '',
        complement: foundCompany.complement ?? '',
        city: foundCompany.city ?? '',
        state: foundCompany.state ?? '',
        zip_code: foundCompany.zip_code ?? '',
        password_hash: foundCompany.user.password_hash,
        created_at: foundCompany.user.created_at,
      },
    }
  }
}
