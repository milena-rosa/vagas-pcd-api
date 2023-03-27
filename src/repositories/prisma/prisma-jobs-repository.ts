import { prisma } from '@/libs/prisma'
import { Job, Prisma } from '@prisma/client'
import { JobsRepository } from '../jobs-repository'

export class PrismaJobsRepository implements JobsRepository {
  async findManyOpenByCompanyId(
    companyId: string,
    page: number,
  ): Promise<Job[]> {
    return await prisma.job.findMany({
      where: { company_id: companyId, closed_at: null },
      take: 20,
      skip: (page - 1) * 20,
    })
  }

  async findManyByCompanyId(companyId: string, page = 1) {
    return await prisma.job.findMany({
      where: { company_id: companyId },
      take: 20,
      skip: (page - 1) * 20,
    })
  }

  async create(data: Prisma.JobUncheckedCreateInput) {
    return await prisma.job.create({ data })
  }
}
