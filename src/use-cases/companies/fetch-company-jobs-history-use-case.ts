import { JobsRepository } from '@/repositories/jobs-repository'
import { Job } from '@prisma/client'

interface FetchCompanyJobsHistoryUseCaseRequest {
  companyId: string
  page?: number
}

interface FetchCompanyJobsHistoryUseCaseResponse {
  jobs: Job[]
  page: number
}

export class FetchCompanyJobsHistoryUseCase {
  constructor(private jobsRepository: JobsRepository) {}

  async execute({
    companyId,
    page = 1,
  }: FetchCompanyJobsHistoryUseCaseRequest): Promise<FetchCompanyJobsHistoryUseCaseResponse> {
    const jobs = await this.jobsRepository.findManyByCompanyId(companyId, page)

    return { jobs, page }
  }
}
