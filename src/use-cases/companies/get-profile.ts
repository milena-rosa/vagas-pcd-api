import {
  CompaniesRepository,
  CompanyUser,
} from '@/repositories/companies-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetCompanyProfileUseCaseRequest {
  cnpj: string
}

interface GetCompanyProfileUseCaseResponse {
  company: CompanyUser
}

export class GetCompanyProfileUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute({
    cnpj,
  }: GetCompanyProfileUseCaseRequest): Promise<GetCompanyProfileUseCaseResponse> {
    const foundCompany = await this.companiesRepository.findByCNPJ(cnpj)
    if (!foundCompany) {
      throw new ResourceNotFoundError()
    }

    return {
      company: foundCompany,
    }
  }
}
