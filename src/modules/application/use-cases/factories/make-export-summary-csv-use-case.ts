import { PrismaApplicationsRepository } from '@/repositories/prisma/prisma-applications-repository'
import { ExportSummaryInCsvFormatUseCase } from '../export-summary-csv'

export function makeExportSummaryCsvUseCase() {
  const applicationsRepository = new PrismaApplicationsRepository()
  return new ExportSummaryInCsvFormatUseCase(applicationsRepository)
}
