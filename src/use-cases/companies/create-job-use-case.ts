import { JobsRepository } from '@/repositories/jobs-repository'
import { DisabilityType, Job } from '@prisma/client'

interface CreateJobUseCaseRequest {
  title: string
  description: string
  role: string
  salary: number
  disabilityType: DisabilityType
  companyId: string
}

interface CreateJobUseCaseResponse {
  job: Job
}

export class CreateJobUseCase {
  constructor(private jobsRepository: JobsRepository) {}

  async execute({
    companyId,
    description,
    disabilityType,
    role,
    salary,
    title,
  }: CreateJobUseCaseRequest): Promise<CreateJobUseCaseResponse> {
    const job = await this.jobsRepository.create({
      company_id: companyId,
      description,
      disability_type: disabilityType,
      role,
      salary,
      title,
    })

    return { job }
  }
}
