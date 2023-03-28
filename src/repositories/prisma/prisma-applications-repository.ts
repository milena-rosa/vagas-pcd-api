import { prisma } from '@/libs/prisma'
import { Prisma } from '@prisma/client'
import { ApplicationsRepository } from '../applications-repository'

export class PrismaApplicationsRepository implements ApplicationsRepository {
  async create(data: Prisma.ApplicationUncheckedCreateInput) {
    return await prisma.application.create({ data })
  }
}
