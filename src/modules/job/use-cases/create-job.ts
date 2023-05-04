import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { CompaniesRepository } from '@/repositories/companies-repository'
import {
  DisabilityTypeDictionary,
  JobsRepository,
  LocationDictionary,
} from '@/repositories/jobs-repository'
import { CreateJobInput, CreateJobReply } from '../job.schema'

export class CreateJobUseCase {
  constructor(
    private jobsRepository: JobsRepository,
    private companiesRepository: CompaniesRepository,
  ) {}

  async execute({
    company_id,
    title,
    description,
    role,
    linkedin,
    salary,
    perks,
    location,
    disability_type,
  }: CreateJobInput): Promise<{ job: CreateJobReply }> {
    const company = await this.companiesRepository.findById(company_id)
    if (!company) {
      throw new ResourceNotFoundError()
    }

    const job = await this.jobsRepository.create({
      company_id,
      title,
      description,
      role,
      linkedin,
      salary,
      perks,
      location,
      disability_type,
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
