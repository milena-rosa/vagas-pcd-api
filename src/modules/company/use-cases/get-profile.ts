import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { CompaniesRepository } from '@/repositories/companies-repository'
import { CompanyProfileParams, CompanyProfileReply } from '../company.schema'

export class GetCompanyProfileUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute({
    company_id,
  }: CompanyProfileParams): Promise<{ company: CompanyProfileReply }> {
    const foundCompany = await this.companiesRepository.findById(company_id)
    if (!foundCompany) {
      throw new ResourceNotFoundError()
    }

    return {
      company: {
        company_id: foundCompany.company_id,
        cnpj: foundCompany.cnpj,
        about: foundCompany.about ?? '',
        linkedin: foundCompany.linkedin ?? '',
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
