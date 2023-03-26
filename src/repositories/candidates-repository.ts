import { Candidate, Prisma } from '@prisma/client'

export interface CandidatesRepository {
  create(data: Prisma.CandidateUncheckedCreateInput): Promise<Candidate>
}
