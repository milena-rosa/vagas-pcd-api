import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import {
  CandidateUser,
  CandidatesRepository,
} from '@/repositories/candidates-repository'

interface GetCandidateProfileUseCaseRequest {
  candidateId: string
}

interface GetCandidateProfileUseCaseResponse {
  candidate: CandidateUser
}

export class GetCandidateProfileUseCase {
  constructor(private candidatesRepository: CandidatesRepository) {}

  async execute({
    candidateId,
  }: GetCandidateProfileUseCaseRequest): Promise<GetCandidateProfileUseCaseResponse> {
    const foundCandidate = await this.candidatesRepository.findById(candidateId)
    if (!foundCandidate) {
      throw new ResourceNotFoundError()
    }

    return { candidate: foundCandidate }
  }
}
