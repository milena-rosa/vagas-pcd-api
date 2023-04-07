import {
  CandidateUser,
  CandidatesRepository,
} from '@/repositories/candidates-repository'

interface ListApplicationsUseCaseRequest {
  jobId: string
  page?: number
}

interface ListApplicationsUseCaseResponse {
  candidates: CandidateUser[]
}

export class ListApplicationsUseCase {
  constructor(private candidatesRepository: CandidatesRepository) {}

  async execute({
    jobId,
    page = 1,
  }: ListApplicationsUseCaseRequest): Promise<ListApplicationsUseCaseResponse> {
    const candidates = await this.candidatesRepository.findManyByJobId(
      jobId,
      page,
    )
    return { candidates }
  }
}
