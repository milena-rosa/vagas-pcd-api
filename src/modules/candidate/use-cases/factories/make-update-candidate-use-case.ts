import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { UpdateCandidateUseCase } from '../update'

export function makeUpdateCandidateUseCase() {
  const candidatesRepository = new PrismaCandidatesRepository()
  return new UpdateCandidateUseCase(candidatesRepository)
}
