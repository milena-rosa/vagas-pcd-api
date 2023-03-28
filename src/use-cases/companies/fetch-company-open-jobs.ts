import { JobsRepository } from '@/repositories/jobs-repository'
import { Job } from '@prisma/client'

interface FetchCompanyOpenJobsUseCaseRequest {
  companyId: string
  page?: number
}

interface FetchCompanyOpenJobsUseCaseResponse {
  jobs: Job[]
  page: number
}

export class FetchCompanyOpenJobsUseCase {
  constructor(private jobsRepository: JobsRepository) {}

  async execute({
    companyId,
    page = 1,
  }: FetchCompanyOpenJobsUseCaseRequest): Promise<FetchCompanyOpenJobsUseCaseResponse> {
    const jobs = await this.jobsRepository.findManyOpenByCompanyId(
      companyId,
      page,
    )

    return { jobs, page }
  }
}
