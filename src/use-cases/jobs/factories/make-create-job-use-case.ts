import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { CreateJobUseCase } from '../create-job'

export function makeCreateJobUseCase() {
  const jobsRepository = new PrismaJobsRepository()
  const companiesRepository = new PrismaCompaniesRepository()
  return new CreateJobUseCase(jobsRepository, companiesRepository)
}
