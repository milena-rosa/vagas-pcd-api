import { Prisma } from '@prisma/client'

const applicationWithJobAndCandidate =
  Prisma.validator<Prisma.ApplicationArgs>()({
    include: { job: true, candidate: true },
  })

export type ApplicationWithJobAndCandidate = Prisma.ApplicationGetPayload<
  typeof applicationWithJobAndCandidate
>

const applicationWithJobAndCompany = Prisma.validator<Prisma.ApplicationArgs>()(
  { include: { job: { include: { company: true } } } },
)

export type ApplicationWithJobAndCompany = Prisma.ApplicationGetPayload<
  typeof applicationWithJobAndCompany
>

export interface ApplicationsRepository {
  findManyOpenByCandidateId(
    candidateId: string,
    page: number,
  ): Promise<ApplicationWithJobAndCompany[]>
  findManyByCandidateId(
    candidateId: string,
    page: number,
  ): Promise<ApplicationWithJobAndCompany[]>
  // findManyByJobId(jobId: string, page: number): Promise<any[]>
  create(
    data: Prisma.ApplicationUncheckedCreateInput,
  ): Promise<ApplicationWithJobAndCandidate>
}
