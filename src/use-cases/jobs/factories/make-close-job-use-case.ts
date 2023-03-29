import { PrismaJobsRepository } from '@/repositories/prisma/prisma-jobs-repository'
import { CloseJobUseCase } from '../close-job'

export function makeCloseJobUseCase() {
  const jobsRepository = new PrismaJobsRepository()
  return new CloseJobUseCase(jobsRepository)
}
