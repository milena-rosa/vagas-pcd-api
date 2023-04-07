import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { CandidatesRepository } from '@/repositories/candidates-repository'
import {
  GetCandidateProfileInput,
  GetCandidateProfileReply,
} from '../candidate.schema'

export class GetCandidateProfileUseCase {
  constructor(private candidatesRepository: CandidatesRepository) {}

  async execute({ candidate_id }: GetCandidateProfileInput): Promise<{
    candidate: GetCandidateProfileReply
  }> {
    const foundCandidate = await this.candidatesRepository.findById(
      candidate_id,
    )
    if (!foundCandidate) {
      throw new ResourceNotFoundError()
    }

    return {
      candidate: {
        candidate_id: foundCandidate.candidate_id,
        name: foundCandidate.name,
        phone: foundCandidate.phone,
        resume: foundCandidate.resume,
        email: foundCandidate.user.email,
        created_at: foundCandidate.user.created_at,
        password_hash: foundCandidate.user.password_hash,
      },
    }
  }
}
