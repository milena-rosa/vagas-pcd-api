import { JobsRepository } from '@/repositories/jobs-repository'
import { Job } from '@prisma/client'

interface ApplyForJobUseCaseRequest {
  candidateId: string
  jobId: string
}

interface ApplyForJobUseCaseResponse {
  jobs: Job[]
  page: number
}

export class ApplyForJobUseCase {
  constructor(private jobsRepository: JobsRepository) {}

  async execute({
    query,
    page = 1,
  }: ApplyForJobUseCaseRequest): Promise<ApplyForJobUseCaseResponse> {
    const jobs = await this.jobsRepository.findMany(query, page)

    return { jobs, page }
  }
}
