import { ApplicationsRepository } from '@/repositories/applications-repository'
import { formatSummaryItem } from '@/utils/format-summary-item'
import { ExportSummaryCSVData } from '../application.schema'

export class ExportSummaryInCsvFormatUseCase {
  constructor(private applicationsRepository: ApplicationsRepository) {}

  async execute(): Promise<ExportSummaryCSVData> {
    const summary = await this.applicationsRepository.countJobsAndApplications()

    const header = [
      'Empresa',
      'CNPJ',
      'E-mail',
      'Telefone',
      'Rua',
      'Número',
      'Complemento',
      'Cidade',
      'Estado',
      'CEP',
      'Vagas abertas',
      'Currículos recebidos',
    ]

    const formattedSummary = summary.map(formatSummaryItem)

    const csvData = formattedSummary.map((summaryItem) =>
      Object.values(summaryItem).map((value) => String(value)),
    )

    csvData.unshift(header)

    return csvData
  }
}
