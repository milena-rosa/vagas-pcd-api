import {
  CompaniesRepository,
  CompanyUser,
} from '@/repositories/companies-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetCompanyProfileUseCaseRequest {
  companyId: string
}

interface GetCompanyProfileUseCaseResponse {
  company: CompanyUser
}

export class GetCompanyProfileUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute({
    companyId,
  }: GetCompanyProfileUseCaseRequest): Promise<GetCompanyProfileUseCaseResponse> {
    const foundCompany = await this.companiesRepository.findById(companyId)
    if (!foundCompany) {
      throw new ResourceNotFoundError()
    }

    return {
      company: foundCompany,
    }
  }
}
