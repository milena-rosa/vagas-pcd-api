import { PrismaApplicationsRepository } from '@/repositories/prisma/prisma-applications-repository'
import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { ApplyForJobUseCase } from '../apply-for-job'

export function makeApplyForJobUseCase() {
  const applicationsRepository = new PrismaApplicationsRepository()
  const jobsRepository = new PrismaJobsRepository()
  return new ApplyForJobUseCase(applicationsRepository, jobsRepository)
}
