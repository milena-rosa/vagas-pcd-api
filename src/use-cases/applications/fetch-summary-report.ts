import { CompaniesRepository } from '@/repositories/companies-repository'

interface FetchSummaryReportUseCaseRequest {
  companyId: string
  page?: number
}

interface FetchSummaryReportUseCaseResponse {
  jobs: any
  page: number
}

export class FetchSummaryReportUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute({
    companyId,
    page = 1,
  }: FetchSummaryReportUseCaseRequest): Promise<FetchSummaryReportUseCaseResponse> {
    const jobs = await this.companiesRepository.findAll()

    return { jobs, page }
  }
}
