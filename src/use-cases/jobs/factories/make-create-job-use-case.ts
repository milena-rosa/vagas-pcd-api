import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { CreateJobUseCase } from '../create-job'

export function makeCreateJobUseCase() {
  const jobsRepository = new PrismaJobsRepository()
  return new CreateJobUseCase(jobsRepository)
}
