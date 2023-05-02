import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateCompanyUseCase } from '../authenticate'

export function makeAuthenticateCompanyUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const companiesRepository = new PrismaCompaniesRepository()
  return new AuthenticateCompanyUseCase(usersRepository, companiesRepository)
}
