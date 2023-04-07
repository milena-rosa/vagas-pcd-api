import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { FetchCompanyJobsHistoryUseCase } from '../fetch-company-jobs-history'

export function makeFetchCompanyJobsHistoryUseCase() {
  const jobsRepository = new PrismaJobsRepository()
  return new FetchCompanyJobsHistoryUseCase(jobsRepository)
}
