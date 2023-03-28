import { ApplicationsRepository } from '@/repositories/applications-repository'
import { Application } from '@prisma/client'

interface FetchJobCandidatesUseCaseRequest {
  companyId: string
  jobId: string
  page?: number
}

interface FetchJobCandidatesUseCaseResponse {
  applications: Application[]
  page: number
}

export class FetchJobCandidatesUseCase {
  constructor(private applicationsRepository: ApplicationsRepository) {}

  async execute({
    companyId,
    jobId,
    page = 1,
  }: FetchJobCandidatesUseCaseRequest): Promise<FetchJobCandidatesUseCaseResponse> {
    const applications =
      await this.applicationsRepository.findManyByCompanyAndJobId(
        companyId,
        jobId,
        page,
      )

    return { applications, page }
  }
}
