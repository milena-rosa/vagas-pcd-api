import { PrismaApplicationsRepository } from '@/repositories/prisma/prisma-applications-repository'
import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { ListApplicationsUseCase } from '../list-applications'

export function makeListApplicationsUseCase() {
  const jobsRepository = new PrismaJobsRepository()
  const applicationsRepository = new PrismaApplicationsRepository()
  return new ListApplicationsUseCase(applicationsRepository, jobsRepository)
}
