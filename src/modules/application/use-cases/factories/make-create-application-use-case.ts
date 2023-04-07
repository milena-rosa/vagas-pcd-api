import { PrismaApplicationsRepository } from '@/repositories/prisma/prisma-applications-repository'
import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { CreateApplicationUseCase } from '../create-application'

export function makeCreateApplicationUseCase() {
  const applicationsRepository = new PrismaApplicationsRepository()
  const jobsRepository = new PrismaJobsRepository()
  return new CreateApplicationUseCase(applicationsRepository, jobsRepository)
}
