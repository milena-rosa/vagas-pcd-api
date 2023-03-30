import { Prisma } from '@prisma/client'

const candidateUser = Prisma.validator<Prisma.CandidateArgs>()({
  include: { user: true },
})

export type CandidateUser = Prisma.CandidateGetPayload<typeof candidateUser>

export interface CandidatesRepository {
  findById(candidateId: string): Promise<CandidateUser | null>
  create(data: Prisma.CandidateCreateInput): Promise<CandidateUser>
  update(
    candidateId: string,
    data: Prisma.CandidateUpdateInput,
  ): Promise<CandidateUser>
}
