import { ApplicationsRepository } from '@/repositories/applications-repository'
import { Application } from '@prisma/client'

interface FetchCandidateApplicationsHistoryUseCaseRequest {
  candidateId: string
  page?: number
}

interface FetchCandidateApplicationsHistoryUseCaseResponse {
  applications: Application[]
  page: number
}

export class FetchCandidateApplicationsHistoryUseCase {
  constructor(private applicationsRepository: ApplicationsRepository) {}

  async execute({
    candidateId,
    page = 1,
  }: FetchCandidateApplicationsHistoryUseCaseRequest): Promise<FetchCandidateApplicationsHistoryUseCaseResponse> {
    const applications =
      await this.applicationsRepository.findManyByCandidateId(candidateId, page)

    return { applications, page }
  }
}
