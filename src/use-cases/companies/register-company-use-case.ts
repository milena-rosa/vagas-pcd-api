import { CompaniesRepository } from '@/repositories/companies-repository'
import { Company } from '@prisma/client'
import { hash } from 'bcryptjs'
import { CNPJAlreadyRegisteredError } from '../errors/cnpj-already-registered-error'
import { EmailAlreadyRegisteredError } from '../errors/email-already-registered-error'

interface RegisterCompanyUseCaseRequest {
  cnpj: string
  email: string
  password: string
}

interface RegisterCompanyUseCaseResponse {
  company: Company
}

export class RegisterCompanyUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute({
    cnpj,
    email,
    password,
  }: RegisterCompanyUseCaseRequest): Promise<RegisterCompanyUseCaseResponse> {
    const companyWithSameEmail = await this.companiesRepository.findByEmail(
      email,
    )
    if (companyWithSameEmail) {
      throw new EmailAlreadyRegisteredError()
    }

    const companyWithSameCNPJ = await this.companiesRepository.findByCNPJ(cnpj)
    if (companyWithSameCNPJ) {
      throw new CNPJAlreadyRegisteredError()
    }

    const password_hash = await hash(password, 6)

    const company = await this.companiesRepository.create({
      cnpj,
      email,
      password_hash,
    })

    return { company }
  }
}
