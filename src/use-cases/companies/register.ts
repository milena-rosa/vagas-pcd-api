import {
  CompaniesRepository,
  CompanyUser,
} from '@/repositories/companies-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { CNPJAlreadyRegisteredError } from '../errors/cnpj-already-registered-error'
import { EmailAlreadyRegisteredError } from '../errors/email-already-registered-error'

interface RegisterCompanyUseCaseRequest {
  cnpj: string
  email: string
  password: string
}

interface RegisterCompanyUseCaseResponse {
  company: CompanyUser
}

export class RegisterCompanyUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private companiesRepository: CompaniesRepository,
  ) {}

  async execute({
    cnpj,
    email,
    password,
  }: RegisterCompanyUseCaseRequest): Promise<RegisterCompanyUseCaseResponse> {
    const companyWithSameEmail = await this.usersRepository.findByEmail(email)
    if (companyWithSameEmail) {
      throw new EmailAlreadyRegisteredError()
    }

    const companyWithSameCNPJ = await this.companiesRepository.findByCNPJ(cnpj)
    if (companyWithSameCNPJ) {
      throw new CNPJAlreadyRegisteredError()
    }

    const passwordHash = await hash(password, 6)

    const company = await this.companiesRepository.create({
      cnpj,
      user: {
        create: {
          email,
          role: 'COMPANY',
          password_hash: passwordHash,
        },
      },
    })

    return { company }
  }
}
