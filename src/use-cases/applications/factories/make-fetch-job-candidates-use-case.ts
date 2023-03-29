import { PrismaApplicationsRepository } from '@/repositories/prisma/prisma-applications-repository'
import { FetchJobCandidatesUseCase } from '../fetch-job-candidates'

export function makeFetchJobCandidatesUseCase() {
  const applicationsRepository = new PrismaApplicationsRepository()
  return new FetchJobCandidatesUseCase(applicationsRepository)
}
