import { PrismaGovernmentUsersRepository } from '@/repositories/prisma/prisma-government-users-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateGovernmentUserUseCase } from '../authenticate'

export function makeAuthenticateGovernmentUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const governmentUsersRepository = new PrismaGovernmentUsersRepository()
  return new AuthenticateGovernmentUserUseCase(
    usersRepository,
    governmentUsersRepository,
  )
}
