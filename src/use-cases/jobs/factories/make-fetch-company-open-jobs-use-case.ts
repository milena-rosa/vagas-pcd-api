import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { FetchCompanyOpenJobsUseCase } from '../fetch-company-open-jobs'

export function makeFetchCompanyOpenJobsUseCase() {
  const jobsRepository = new PrismaJobsRepository()
  return new FetchCompanyOpenJobsUseCase(jobsRepository)
}
