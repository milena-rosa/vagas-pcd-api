import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { AuthenticateCandidateUseCase } from '../authenticate'

export function makeAuthenticateCandidateUseCase() {
  const candidatesRepository = new PrismaCandidatesRepository()
  return new AuthenticateCandidateUseCase(candidatesRepository)
}
