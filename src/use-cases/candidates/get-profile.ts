import { CandidatesRepository } from '@/repositories/candidates-repository'
import { Candidate } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetCandidateProfileUseCaseRequest {
  candidateId: string
}

interface GetCandidateProfileUseCaseResponse {
  candidate: Candidate
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
