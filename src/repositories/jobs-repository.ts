import { Job, Prisma } from '@prisma/client'

export interface JobsRepository {
  findById(id: string): Promise<Job | null>
  findManyByCompanyId(companyId: string, page: number): Promise<Job[]>
  findManyOpenByCompanyId(companyId: string, page: number): Promise<Job[]>
  create(data: Prisma.JobUncheckedCreateInput): Promise<Job>
  update(id: string, data: Prisma.JobUncheckedUpdateInput): Promise<Job>
}
