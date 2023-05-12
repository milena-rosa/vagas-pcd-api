import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { GetJobWithCompanyUseCase } from '../get-job-with-company'

export function makeGetJobWithCompanyUseCase() {
  const jobsRepository = new PrismaJobsRepository()
  return new GetJobWithCompanyUseCase(jobsRepository)
}
