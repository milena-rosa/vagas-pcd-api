import {
  ApplicationWithJobAndCompany,
  ApplicationsRepository,
} from '@/repositories/applications-repository'

interface FetchCandidateApplicationsHistoryUseCaseRequest {
  candidateId: string
  page?: number
}

interface FetchCandidateApplicationsHistoryUseCaseResponse {
  applications: ApplicationWithJobAndCompany[]
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
