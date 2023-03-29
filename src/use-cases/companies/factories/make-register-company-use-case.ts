import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { RegisterCompanyUseCase } from '../register'

export function makeRegisterCompanyUseCase() {
  const companiesRepository = new PrismaCompaniesRepository()
  return new RegisterCompanyUseCase(companiesRepository)
}
