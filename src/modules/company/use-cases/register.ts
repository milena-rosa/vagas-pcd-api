import { CNPJAlreadyRegisteredError } from '@/errors/cnpj-already-registered-error'
import { EmailAlreadyRegisteredError } from '@/errors/email-already-registered-error'
import { InvalidCNPJError } from '@/errors/invalid-cnpj-error'
import { CompaniesRepository } from '@/repositories/companies-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { CreateCompanyInput, CreateCompanyReply } from '../company.schema'

export class RegisterCompanyUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private companiesRepository: CompaniesRepository,
  ) {}

  async execute({
    cnpj,
    email,
    about,
    linkedin,
    password,
  }: CreateCompanyInput): Promise<{ company: CreateCompanyReply }> {
    const companyWithSameEmail = await this.usersRepository.findByEmail(email)
    if (companyWithSameEmail) {
      throw new EmailAlreadyRegisteredError()
    }

    const companyWithSameCNPJ = await this.companiesRepository.findByCNPJ(cnpj)
    if (companyWithSameCNPJ) {
      throw new CNPJAlreadyRegisteredError()
    }

    const passwordHash = await hash(password, 6)

    try {
      const company = await this.companiesRepository.create({
        cnpj,
        about,
        linkedin,
        user: {
          create: {
            email,
            role: 'COMPANY',
            password_hash: passwordHash,
          },
        },
      })

      return {
        company: {
          company_id: company.company_id,
          cnpj: company.cnpj,
          about: company.about ?? '',
          linkedin: company.linkedin ?? '',
          name: company.name ?? '',
          email: company.user.email,
          phone: company.phone ?? '',
          street: company.street ?? '',
          number: company.number ?? '',
          complement: company.complement ?? '',
          city: company.city ?? '',
          state: company.state ?? '',
          zip_code: company.zip_code ?? '',
          password_hash: company.user.password_hash,
          created_at: company.user.created_at,
        },
      }
    } catch (error) {
      throw new InvalidCNPJError()
    }
  }
}
