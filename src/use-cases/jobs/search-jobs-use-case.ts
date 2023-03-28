import { JobsRepository } from '@/repositories/jobs-repository'
import { Job } from '@prisma/client'

interface SearchJobsUseCaseRequest {
  query: string
  page?: number
}

interface SearchJobsUseCaseResponse {
  jobs: Job[]
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
