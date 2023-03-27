import { JobsRepository } from '@/repositories/jobs-repository'
import { Job } from '@prisma/client'
import { JobAlreadyClosedError } from '../errors/job-already-closed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface CloseJobUseCaseRequest {
  jobId: string
}

interface CloseJobUseCaseResponse {
  job: Job
}

export class CloseJobUseCase {
  constructor(private jobsRepository: JobsRepository) {}

  async execute({
    jobId,
  }: CloseJobUseCaseRequest): Promise<CloseJobUseCaseResponse> {
    const foundJob = await this.jobsRepository.findById(jobId)
    if (!foundJob) {
      throw new ResourceNotFoundError()
    }

    if (foundJob.closed_at !== null) {
      throw new JobAlreadyClosedError()
    }

    const job = await this.jobsRepository.update(jobId, {
      closed_at: new Date(),
    })

    return { job }
  }
}
