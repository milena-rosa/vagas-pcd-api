import { Application, Prisma } from '@prisma/client'

export interface ApplicationsRepository {
  findManyOpenByCandidateId(
    candidateId: string,
    page: number,
  ): Promise<Application[]>
  findManyByCandidateId(
    candidateId: string,
    page: number,
  ): Promise<Application[]>
  create(data: Prisma.ApplicationUncheckedCreateInput): Promise<Application>
}
