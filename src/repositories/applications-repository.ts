import { Summary } from '@/modules/application/application.schema'
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

const applicationWithCandidate = Prisma.validator<Prisma.ApplicationArgs>()({
  include: { candidate: { include: { user: true } } },
})

export type ApplicationWithCandidate = Prisma.ApplicationGetPayload<
  typeof applicationWithCandidate
>

export interface ApplicationsRepository {
  countJobsAndApplications(): Promise<Summary>
  findByCandidateIdAndJobId(
    candidateId: string,
    jobId: string,
  ): Promise<ApplicationWithJobAndCandidate | null>
  findManyOpenByCandidateId(
    candidateId: string,
    page: number,
  ): Promise<ApplicationWithJobAndCompany[]>
  findManyByCandidateId(
    candidateId: string,
    page: number,
  ): Promise<ApplicationWithJobAndCompany[]>
  findManyByJobId(
    jobId: string,
    page: number,
  ): Promise<ApplicationWithCandidate[]>
  create(
    data: Prisma.ApplicationUncheckedCreateInput,
  ): Promise<ApplicationWithJobAndCandidate>
}
