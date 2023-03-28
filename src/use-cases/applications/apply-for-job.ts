import { ApplicationsRepository } from '@/repositories/applications-repository'
import { JobsRepository } from '@/repositories/jobs-repository'
import { Application } from '@prisma/client'
import { JobClosedError } from '../errors/job-closed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface ApplyForJobUseCaseRequest {
  candidateId: string
  jobId: string
}

interface ApplyForJobUseCaseResponse {
  application: Application
}

export class ApplyForJobUseCase {
  constructor(
    private applicationsRepository: ApplicationsRepository,
    private jobsRepository: JobsRepository,
  ) {}

  async execute({
    candidateId,
    jobId,
  }: ApplyForJobUseCaseRequest): Promise<ApplyForJobUseCaseResponse> {
    const foundJob = await this.jobsRepository.findById(jobId)
    if (!foundJob) {
      throw new ResourceNotFoundError()
    }

    if (foundJob.closed_at !== null) {
      throw new JobClosedError()
    }

    const application = await this.applicationsRepository.create({
      candidate_id: candidateId,
      job_id: jobId,
    })

    return { application }
  }
}
