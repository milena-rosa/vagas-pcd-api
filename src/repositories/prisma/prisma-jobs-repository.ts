import { prisma } from '@/libs/prisma'
import { Prisma } from '@prisma/client'
import { JobsRepository } from '../jobs-repository'

export class PrismaJobsRepository implements JobsRepository {
  async create(data: Prisma.JobUncheckedCreateInput) {
    return await prisma.job.create({ data })
  }
}
