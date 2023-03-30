import { prisma } from '@/libs/prisma'
import { Prisma } from '@prisma/client'
import { ApplicationsRepository } from '../applications-repository'

export class PrismaApplicationsRepository implements ApplicationsRepository {
  async findManyOpenByCandidateId(candidateId: string, page: number) {
    return await prisma.application.findMany({
      where: {
        candidate_id: candidateId,
        job: { closed_at: null },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
      include: {
        job: {
          include: { company: true },
        },
      },
    })
  }

  async findManyByCandidateId(candidateId: string, page: number) {
    return await prisma.application.findMany({
      where: {
        candidate: { candidate_id: candidateId },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
      include: {
        job: {
          include: { company: true },
        },
      },
    })
  }

  async create({
    candidate_id,
    job_id,
  }: Prisma.ApplicationUncheckedCreateInput) {
    return await prisma.application.create({
      data: {
        candidate: { connect: { candidate_id } },
        job: { connect: { id: job_id } },
      },
      include: {
        candidate: true,
        job: true,
      },
    })
  }
}
