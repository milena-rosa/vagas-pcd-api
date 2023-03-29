import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { GetCompanyProfileUseCase } from '../get-profile'

export function makeGetCompanyProfileUseCase() {
  const companiesRepository = new PrismaCompaniesRepository()
  return new GetCompanyProfileUseCase(companiesRepository)
}
