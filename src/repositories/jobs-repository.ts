import { Job, Prisma } from '@prisma/client'

export interface JobsRepository {
  findManyByCompanyId(companyId: string, page: number): Promise<Job[]>
  findManyOpenByCompanyId(companyId: string, page: number): Promise<Job[]>
  create(data: Prisma.JobUncheckedCreateInput): Promise<Job>
}
