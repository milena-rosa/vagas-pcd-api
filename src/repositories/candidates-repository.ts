import { Candidate, Prisma } from '@prisma/client'

export interface CandidatesRepository {
  findByEmail(email: string): Promise<Candidate | null>
  create(data: Prisma.CandidateCreateInput): Promise<Candidate>
}
