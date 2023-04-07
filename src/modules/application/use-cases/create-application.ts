import { JobClosedError } from '@/errors/job-closed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { ApplicationsRepository } from '@/repositories/applications-repository'
import { JobsRepository } from '@/repositories/jobs-repository'
import { Application } from '@prisma/client'

interface CreateApplicationUseCaseRequest {
  candidateId: string
  jobId: string
}

interface CreateApplicationUseCaseResponse {
  application: Application
}

export class CreateApplicationUseCase {
  constructor(
    private applicationsRepository: ApplicationsRepository,
    private jobsRepository: JobsRepository,
  ) {}

  async execute({
    candidateId,
    jobId,
  }: CreateApplicationUseCaseRequest): Promise<CreateApplicationUseCaseResponse> {
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
