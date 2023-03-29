import { CompaniesRepository } from '@/repositories/companies-repository'
import { Company } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetCompanyProfileUseCaseRequest {
  cnpj: string
}

interface GetCompanyProfileUseCaseResponse {
  company: Company
}

export class GetCompanyProfileUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute({
    cnpj,
  }: GetCompanyProfileUseCaseRequest): Promise<GetCompanyProfileUseCaseResponse> {
    const foundCompany = await this.companiesRepository.findByCNPJ(cnpj)
    if (!foundCompany || !foundCompany.email) {
      throw new ResourceNotFoundError()
    }

    return {
      company: foundCompany,
    }
  }
}
