import { JobClosedError } from '@/errors/job-closed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import {
  DisabilityTypeDictionary,
  JobsRepository,
  LocationDictionary,
} from '@/repositories/jobs-repository'
import { CloseJobParams, CloseJobReply } from '../job.schema'

export class CloseJobUseCase {
  constructor(private jobsRepository: JobsRepository) {}

  async execute({ job_id }: CloseJobParams): Promise<{ job: CloseJobReply }> {
    const foundJob = await this.jobsRepository.findById(job_id)
    if (!foundJob) {
      throw new ResourceNotFoundError()
    }

    if (foundJob.closed_at !== null) {
      throw new JobClosedError()
    }

    const job = await this.jobsRepository.update(job_id, {
      closed_at: new Date(),
    })

    return {
      job: {
        ...job,
        linkedin: job.linkedin ?? '',
        disability_type: DisabilityTypeDictionary[job.disability_type],
        location: LocationDictionary[job.location],
      },
    }
  }
}
