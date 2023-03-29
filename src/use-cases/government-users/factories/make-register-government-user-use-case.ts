import { PrismaGovernmentUsersRepository } from '@/repositories/prisma/prisma-government-users-repository'
import { RegisterGovernmentUserUseCase } from '../register'

export function makeRegisterGovernmentUserUseCase() {
  const governmentUsersRepository = new PrismaGovernmentUsersRepository()
  return new RegisterGovernmentUserUseCase(governmentUsersRepository)
}
