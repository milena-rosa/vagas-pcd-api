import { PrismaApplicationsRepository } from '@/repositories/prisma/prisma-applications-repository'
import { SummaryUseCase } from '../summary'

export function makeSummaryUseCase() {
  const applicationsRepository = new PrismaApplicationsRepository()
  return new SummaryUseCase(applicationsRepository)
}
