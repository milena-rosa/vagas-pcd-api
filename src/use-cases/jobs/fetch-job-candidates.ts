import {
  CandidateUser,
  CandidatesRepository,
} from '@/repositories/candidates-repository'

interface FetchJobCandidatesUseCaseRequest {
  jobId: string
  page?: number
}

interface FetchJobCandidatesUseCaseResponse {
  candidates: CandidateUser[]
}

export class FetchJobCandidatesUseCase {
  constructor(private candidatesRepository: CandidatesRepository) {}

  async execute({
    jobId,
    page = 1,
  }: FetchJobCandidatesUseCaseRequest): Promise<FetchJobCandidatesUseCaseResponse> {
    const candidates = await this.candidatesRepository.findManyByJobId(
      jobId,
      page,
    )
    return { candidates }
  }
}
