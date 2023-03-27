import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { FetchCompanyInformationUseCase } from '../fetch-company-information-use-case'

export function makeGetCompanyProfileUseCase() {
  const companiesRepository = new PrismaCompaniesRepository()
  return new FetchCompanyInformationUseCase(companiesRepository)
}
