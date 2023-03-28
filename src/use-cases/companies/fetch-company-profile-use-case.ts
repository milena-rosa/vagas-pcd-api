import { CompaniesRepository } from '@/repositories/companies-repository'
import { Company } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface FetchCompanyProfileUseCaseRequest {
  cnpj: string
}

interface FetchCompanyProfileUseCaseResponse {
  company: Company
}

export class FetchCompanyProfileUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute({
    cnpj,
  }: FetchCompanyProfileUseCaseRequest): Promise<FetchCompanyProfileUseCaseResponse> {
    const foundCompany = await this.companiesRepository.findByCNPJ(cnpj)
    if (!foundCompany || !foundCompany.email) {
      throw new ResourceNotFoundError()
    }

    return {
      company: foundCompany,
    }
  }
}
