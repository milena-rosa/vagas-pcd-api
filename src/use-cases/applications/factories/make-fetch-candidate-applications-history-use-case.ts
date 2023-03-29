import { PrismaApplicationsRepository } from '@/repositories/prisma/prisma-applications-repository'
import { FetchCandidateApplicationsHistoryUseCase } from '../fetch-candidate-applications-history'

export function makeFetchCandidateApplicationsHistoryUseCase() {
  const applicationsRepository = new PrismaApplicationsRepository()
  return new FetchCandidateApplicationsHistoryUseCase(applicationsRepository)
}
