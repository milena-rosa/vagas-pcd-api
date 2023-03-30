import { PrismaApplicationsRepository } from '@/repositories/prisma/prisma-applications-repository'
import { FetchCandidateOpenApplicationsUseCase } from '../fetch-candidate-open-applications'

export function makeFetchCandidateOpenApplicationsUseCase() {
  const applicationsRepository = new PrismaApplicationsRepository()
  return new FetchCandidateOpenApplicationsUseCase(applicationsRepository)
}
