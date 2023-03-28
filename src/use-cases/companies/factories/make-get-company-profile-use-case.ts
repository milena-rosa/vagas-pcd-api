import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { FetchCompanyProfileUseCase } from '../fetch-company-profile-use-case'

export function makeGetCompanyProfileUseCase() {
  const companiesRepository = new PrismaCompaniesRepository()
  return new FetchCompanyProfileUseCase(companiesRepository)
}
