import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterCandidateUseCase } from '../register'

export function makeRegisterCandidateUseCase() {
  const candidatesRepository = new PrismaCandidatesRepository()
  const usersRepository = new PrismaUsersRepository()
  return new RegisterCandidateUseCase(usersRepository, candidatesRepository)
}
