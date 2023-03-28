import { ApplicationsRepository } from '@/repositories/applications-repository'
import { Application } from '@prisma/client'

interface FetchCandidateOpenApplicationsUseCaseRequest {
  candidateId: string
  page?: number
}

interface FetchCandidateOpenApplicationsUseCaseResponse {
  applications: Application[]
  page: number
}

export class FetchCandidateOpenApplicationsUseCase {
  constructor(private applicationsRepository: ApplicationsRepository) {}

  async execute({
    candidateId,
    page = 1,
  }: FetchCandidateOpenApplicationsUseCaseRequest): Promise<FetchCandidateOpenApplicationsUseCaseResponse> {
    const applications =
      await this.applicationsRepository.findManyOpenByCandidateId(
        candidateId,
        page,
      )

    return { applications, page }
  }
}
