import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { FetchSummaryReportUseCase } from '../fetch-summary-report'

export function makeFetchSummaryReportUseCase() {
  const companiesRepository = new PrismaCompaniesRepository()
  return new FetchSummaryReportUseCase(companiesRepository)
}
