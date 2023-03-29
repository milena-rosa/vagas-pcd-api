import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUserUseCase } from '../authenticate'

export function makeAuthenticateUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  return new AuthenticateUserUseCase(usersRepository)
}
