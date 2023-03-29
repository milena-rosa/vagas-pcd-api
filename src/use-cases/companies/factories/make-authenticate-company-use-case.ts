import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { AuthenticateCompanyUseCase } from '../authenticate'

export function makeAuthenticateCompanyUseCase() {
  const companiesRepository = new PrismaCompaniesRepository()
  return new AuthenticateCompanyUseCase(companiesRepository)
}
