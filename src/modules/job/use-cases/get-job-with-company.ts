import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import {
  DisabilityTypeDictionary,
  JobsRepository,
  LocationDictionary,
} from '@/repositories/jobs-repository'
import { GetJobParams, GetJobReply } from '../job.schema'

export class GetJobWithCompanyUseCase {
  constructor(private jobsRepository: JobsRepository) {}

  async execute({ job_id }: GetJobParams): Promise<GetJobReply> {
    const foundJob = await this.jobsRepository.findByIdWithCompany(job_id)
    if (!foundJob) {
      throw new ResourceNotFoundError()
    }

    return {
      job: {
        job_id: foundJob.job_id,
        title: foundJob.title,
        role: foundJob.role,
        description: foundJob.description,
        salary: foundJob.salary,
        perks: foundJob.perks,
        linkedin: foundJob.linkedin ?? '',
        disability_type: DisabilityTypeDictionary[foundJob.disability_type],
        location: LocationDictionary[foundJob.location],
        created_at: foundJob.created_at,
        closed_at: foundJob.closed_at,
      },
      company: {
        cnpj: foundJob.company.cnpj,
        about: foundJob.company.about ?? '',
        linkedin: foundJob.company.linkedin ?? '',
        email: foundJob.company.user.email,
        name: foundJob.company.name ?? '',
        phone: foundJob.company.phone ?? '',
        street: foundJob.company.street ?? '',
        number: foundJob.company.number ?? '',
        complement: foundJob.company.complement ?? '',
        city: foundJob.company.city ?? '',
        state: foundJob.company.state ?? '',
        zip_code: foundJob.company.zip_code ?? '',
      },
    }
  }
}
