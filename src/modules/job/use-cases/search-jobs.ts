import { JobsRepository } from '@/repositories/jobs-repository'
import { formatJobWithCompany } from '@/utils/format-job-with-company'
import { SearchJobQuerystring, SearchJobReply } from '../job.schema'

export class SearchJobsUseCase {
  constructor(private jobsRepository: JobsRepository) {}

  async execute({
    query,
    page = 1,
  }: SearchJobQuerystring): Promise<{ jobs: SearchJobReply; page: number }> {
    const jobs = await this.jobsRepository.findMany(query, page)

    return { jobs: jobs.map(formatJobWithCompany), page }
  }
}
