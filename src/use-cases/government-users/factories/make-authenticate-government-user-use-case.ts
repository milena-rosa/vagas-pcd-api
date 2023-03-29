import { PrismaGovernmentUsersRepository } from '@/repositories/prisma/prisma-government-users-repository'
import { AuthenticateGovernmentUserUseCase } from '../authenticate'

export function makeAuthenticateGovernmentUserUseCase() {
  const governmentUsersRepository = new PrismaGovernmentUsersRepository()
  return new AuthenticateGovernmentUserUseCase(governmentUsersRepository)
}
