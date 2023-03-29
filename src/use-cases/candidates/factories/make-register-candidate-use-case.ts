import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { RegisterCandidateUseCase } from '../register'

export function makeRegisterCandidateUseCase() {
  const candidatesRepository = new PrismaCandidatesRepository()
  return new RegisterCandidateUseCase(candidatesRepository)
}
