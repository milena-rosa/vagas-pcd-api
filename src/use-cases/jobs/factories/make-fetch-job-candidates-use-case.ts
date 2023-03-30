import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { FetchJobCandidatesUseCase } from '../fetch-job-candidates'

export function makeFetchJobCandidatesUseCase() {
  const candidatesRepository = new PrismaCandidatesRepository()
  return new FetchJobCandidatesUseCase(candidatesRepository)
}
