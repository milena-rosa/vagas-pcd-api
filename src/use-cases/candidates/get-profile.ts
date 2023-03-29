import {
  CandidateUser,
  CandidatesRepository,
} from '@/repositories/candidates-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetCandidateProfileUseCaseRequest {
  userId: string
}

interface GetCandidateProfileUseCaseResponse {
  candidate: CandidateUser
}

export class GetCandidateProfileUseCase {
  constructor(private candidatesRepository: CandidatesRepository) {}

  async execute({
    userId,
  }: GetCandidateProfileUseCaseRequest): Promise<GetCandidateProfileUseCaseResponse> {
    const foundCandidate = await this.candidatesRepository.findByUserId(userId)
    if (!foundCandidate) {
      throw new ResourceNotFoundError()
    }

    return { candidate: foundCandidate }
  }
}
