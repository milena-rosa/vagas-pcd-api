import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { SearchJobsUseCase } from '../search-jobs-use-case'

export function makeSearchJobsUseCase() {
  const jobsRepository = new PrismaJobsRepository()
  return new SearchJobsUseCase(jobsRepository)
}
