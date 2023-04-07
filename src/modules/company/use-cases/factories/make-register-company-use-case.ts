import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterCompanyUseCase } from '../register'

export function makeRegisterCompanyUseCase() {
  const companiesRepository = new PrismaCompaniesRepository()
  const usersRepository = new PrismaUsersRepository()
  return new RegisterCompanyUseCase(usersRepository, companiesRepository)
}
