import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { ListApplicationsUseCase } from '../list-applications'

export function makeListApplicationsUseCase() {
  const candidatesRepository = new PrismaCandidatesRepository()
  return new ListApplicationsUseCase(candidatesRepository)
}
