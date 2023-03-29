import { PrismaGovernmentUsersRepository } from '@/repositories/prisma/prisma-government-users-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterGovernmentUserUseCase } from '../register'

export function makeRegisterGovernmentUserUseCase() {
  const governmentUsersRepository = new PrismaGovernmentUsersRepository()
  const usersRepository = new PrismaUsersRepository()
  return new RegisterGovernmentUserUseCase(
    usersRepository,
    governmentUsersRepository,
  )
}
