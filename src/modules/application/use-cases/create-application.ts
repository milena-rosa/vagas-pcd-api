import { JobClosedError } from '@/errors/job-closed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { ApplicationsRepository } from '@/repositories/applications-repository'
import { JobsRepository } from '@/repositories/jobs-repository'
import {
  CreateApplicationInput,
  CreateApplicationReply,
} from '../application.schema'

export class CreateApplicationUseCase {
  constructor(
    private applicationsRepository: ApplicationsRepository,
    private jobsRepository: JobsRepository,
  ) {}

  async execute({ candidate_id, job_id }: CreateApplicationInput): Promise<{
    application: CreateApplicationReply
  }> {
    const foundJob = await this.jobsRepository.findById(job_id)
    if (!foundJob) {
      throw new ResourceNotFoundError()
    }

    if (foundJob.closed_at !== null) {
      throw new JobClosedError()
    }

    const application = await this.applicationsRepository.create({
      candidate_id,
      job_id,
    })

    return { application }
  }
}
