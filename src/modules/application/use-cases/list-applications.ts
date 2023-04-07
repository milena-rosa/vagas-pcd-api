import { CandidatesRepository } from '@/repositories/candidates-repository'
import {
  ListJobApplicationInput,
  ListJobApplicationsReply,
} from '../application.schema'

export class ListApplicationsUseCase {
  constructor(private candidatesRepository: CandidatesRepository) {}

  async execute({
    job_id,
    page = 1,
  }: ListJobApplicationInput): Promise<ListJobApplicationsReply> {
    const candidates = await this.candidatesRepository.findManyByJobId(
      job_id,
      page,
    )

    const formattedCandidates = {
      job_id,
      candidates: candidates.map((candidate) => ({
        candidate_id: candidate.candidate_id,
        name: candidate.name,
        email: candidate.user.email,
        phone: candidate.phone,
        resume: candidate.resume,
      })),
    }

    return { ...formattedCandidates }
  }
}
