import { Prisma } from '@prisma/client'

const candidateUser = Prisma.validator<Prisma.CandidateArgs>()({
  include: { user: true },
})

export type CandidateUser = Prisma.CandidateGetPayload<typeof candidateUser>

const candidateUserApplication = Prisma.validator<Prisma.CandidateArgs>()({
  include: { user: true, applications: true },
})

export type CandidateUserApplication = Prisma.CandidateGetPayload<
  typeof candidateUserApplication
>

export interface CandidatesRepository {
  findById(candidateId: string): Promise<CandidateUser | null>
  findManyByJobId(jobId: string, page: number): Promise<CandidateUser[]>
  create(data: Prisma.CandidateCreateInput): Promise<CandidateUser>
  update(
    candidateId: string,
    data: Prisma.CandidateUpdateInput,
  ): Promise<CandidateUser>
}
