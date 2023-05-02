import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateCandidateUseCase } from '../authenticate'

export function makeAuthenticateCandidateUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const candidatesRepository = new PrismaCandidatesRepository()
  return new AuthenticateCandidateUseCase(usersRepository, candidatesRepository)
}
