import { Candidate, Prisma } from '@prisma/client'

export interface CandidatesRepository {
  findById(id: string): Promise<Candidate | null>
  findByEmail(email: string): Promise<Candidate | null>
  create(data: Prisma.CandidateCreateInput): Promise<Candidate>
  update(id: string, data: Prisma.CandidateUpdateInput): Promise<Candidate>
}
