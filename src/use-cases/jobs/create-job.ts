import { CompaniesRepository } from '@/repositories/companies-repository'
import { JobsRepository } from '@/repositories/jobs-repository'
import { DisabilityType, Job, Location } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface CreateJobUseCaseRequest {
  title: string
  description: string
  role: string
  salary: number
  location: Location
  disabilityType: DisabilityType
  companyId: string
}

interface CreateJobUseCaseResponse {
  job: Job
}

export class CreateJobUseCase {
  constructor(
    private jobsRepository: JobsRepository,
    private companiesRepository: CompaniesRepository,
  ) {}

  async execute({
    companyId,
    title,
    description,
    role,
    salary,
    location,
    disabilityType,
  }: CreateJobUseCaseRequest): Promise<CreateJobUseCaseResponse> {
    const company = await this.companiesRepository.findById(companyId)
    if (!company) {
      throw new ResourceNotFoundError()
    }

    const job = await this.jobsRepository.create({
      company_id: companyId,
      title,
      description,
      role,
      salary,
      location,
      disability_type: disabilityType,
    })

    return { job }
  }
}
