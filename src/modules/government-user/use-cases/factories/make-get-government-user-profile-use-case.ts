import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetGovernmentUserProfileUseCase } from '../get-profile'

export function makeGetGovernmentUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  return new GetGovernmentUserProfileUseCase(usersRepository)
}
