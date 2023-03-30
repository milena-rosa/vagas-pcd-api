import {
  ApplicationWithJobAndCompany,
  ApplicationsRepository,
} from '@/repositories/applications-repository'

interface FetchCandidateOpenApplicationsUseCaseRequest {
  candidateId: string
  page?: number
}

interface FetchCandidateOpenApplicationsUseCaseResponse {
  applications: ApplicationWithJobAndCompany[]
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
