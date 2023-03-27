import {
  CompaniesRepository,
  CompanyData,
} from '@/repositories/companies-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface FetchCompanyInformationUseCaseRequest {
  cnpj: string
}

interface FetchCompanyInformationUseCaseResponse {
  company: CompanyData
}

export class FetchCompanyInformationUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute({
    cnpj,
  }: FetchCompanyInformationUseCaseRequest): Promise<FetchCompanyInformationUseCaseResponse> {
    const foundCompany = await this.companiesRepository.findByCNPJ(cnpj)
    if (!foundCompany || !foundCompany.email) {
      throw new ResourceNotFoundError()
    }

    try {
      const company = await this.companiesRepository.show(
        cnpj,
        foundCompany.email,
      )

      return {
        company,
      }
    } catch (error) {
      throw new ResourceNotFoundError()
    }
  }
}
