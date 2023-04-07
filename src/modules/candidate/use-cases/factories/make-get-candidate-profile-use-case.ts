import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { GetCandidateProfileUseCase } from '../get-profile'

export function makeGetCandidateProfileUseCase() {
  const candidatesRepository = new PrismaCandidatesRepository()
  return new GetCandidateProfileUseCase(candidatesRepository)
}
