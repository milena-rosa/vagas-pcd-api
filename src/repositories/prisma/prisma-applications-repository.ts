import { prisma } from '@/libs/prisma'
import { Prisma } from '@prisma/client'
import { ApplicationsRepository } from '../applications-repository'

export class PrismaApplicationsRepository implements ApplicationsRepository {
  async findManyOpenByCandidateId(candidateId: string, page: number) {
    return await prisma.application.findMany({
      where: {
        candidate_id: candidateId,
        job: {
          closed_at: null,
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })
  }

  async findManyByCandidateId(candidateId: string, page: number) {
    return await prisma.application.findMany({
      where: { candidate_id: candidateId },
      orderBy: {
        created_at: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })
  }

  async create(data: Prisma.ApplicationUncheckedCreateInput) {
    return await prisma.application.create({ data })
  }
}
