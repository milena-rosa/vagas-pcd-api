import { JobsRepository } from '@/repositories/jobs-repository'
import { formatJob } from '@/utils/format-job'
import { CompanyJobsListInput, JobListReply } from '../job.schema'

export class FetchCompanyOpenJobsUseCase {
  constructor(private jobsRepository: JobsRepository) {}

  async execute({
    company_id,
    page = 1,
  }: CompanyJobsListInput): Promise<{ jobs: JobListReply; page: number }> {
    const jobs = await this.jobsRepository.findManyOpenByCompanyId(
      company_id,
      page,
    )

    return { jobs: jobs.map(formatJob), page }
  }
}
