import { Candidate, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { CandidatesRepository } from '../candidates-repository'

export class InMemoryCandidatesRepository implements CandidatesRepository {
  public candidates: Candidate[] = []

  async create(data: Prisma.CandidateUncheckedCreateInput) {
    const candidate: Candidate = {
      id: randomUUID(),
      resume: data.resume,
      user_id: data.user_id,
    }

    this.candidates.push(candidate)

    return candidate
  }
}
