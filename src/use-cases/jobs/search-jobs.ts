import { JobWithCompany, JobsRepository } from '@/repositories/jobs-repository'

interface SearchJobsUseCaseRequest {
  query: string
  page?: number
}

interface SearchJobsUseCaseResponse {
  jobs: JobWithCompany[]
  page: number
}

export class SearchJobsUseCase {
  constructor(private jobsRepository: JobsRepository) {}

  async execute({
    query,
    page = 1,
  }: SearchJobsUseCaseRequest): Promise<SearchJobsUseCaseResponse> {
    const jobs = await this.jobsRepository.findMany(query, page)
    return { jobs, page }
  }
}
