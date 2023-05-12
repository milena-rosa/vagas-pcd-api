import { DisabilityType, Job, Location, Prisma } from '@prisma/client'

export const DisabilityTypeDictionary = {
  [DisabilityType.ANY]: 'qualquer',
  [DisabilityType.HEARING]: 'audição',
  [DisabilityType.MENTAL]: 'mental',
  [DisabilityType.MULTIPLE]: 'múltipla',
  [DisabilityType.PHYSICAL]: 'física',
  [DisabilityType.VISUAL]: 'visual',
}

export const LocationDictionary = {
  [Location.HYBRID]: 'híbrido',
  [Location.ON_SITE]: 'presencial',
  [Location.REMOTE]: 'remoto',
}

const jobCompany = Prisma.validator<Prisma.JobArgs>()({
  include: { company: { include: { user: true } } },
})

export type JobWithCompany = Prisma.JobGetPayload<typeof jobCompany>

const jobApplicationWithCandidatesAndUser = Prisma.validator<Prisma.JobArgs>()({
  include: {
    applications: { include: { candidate: { include: { user: true } } } },
  },
})

export type JobWithCandidate = Prisma.JobGetPayload<
  typeof jobApplicationWithCandidatesAndUser
>

const jobWithApplications = Prisma.validator<Prisma.JobArgs>()({
  include: { applications: true },
})

export type JobWithApplications = Prisma.JobGetPayload<
  typeof jobWithApplications
>

export interface JobsRepository {
  findById(jobId: string): Promise<Job | null>
  findByIdWithCompany(jobId: string): Promise<JobWithCompany | null>
  findMany(query: string, page: number): Promise<JobWithCompany[]>
  findManyByCompanyId(
    companyId: string,
    page: number,
  ): Promise<JobWithApplications[]>
  findManyOpenByCompanyId(
    companyId: string,
    page: number,
  ): Promise<JobWithApplications[]>
  create(data: Prisma.JobUncheckedCreateInput): Promise<Job>
  update(jobId: string, data: Prisma.JobUncheckedUpdateInput): Promise<Job>
}
