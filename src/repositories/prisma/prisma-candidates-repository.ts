import { prisma } from '@/libs/prisma'
import { Prisma } from '@prisma/client'
import { CandidatesRepository } from '../candidates-repository'

export class PrismaCandidatesRepository implements CandidatesRepository {
  async findById(id: string) {
    return await prisma.candidate.findUnique({
      where: { id },
      include: { user: true },
    })
  }

  async findByUserId(userId: string) {
    return await prisma.candidate.findFirst({
      where: { user: { user_id: userId } },
      include: { user: true },
    })
  }

  async create(data: Prisma.CandidateCreateInput) {
    return await prisma.candidate.create({ data, include: { user: true } })
  }

  async update(id: string, data: Prisma.CandidateUpdateInput) {
    return await prisma.candidate.update({
      where: { id },
      data,
      include: { user: true },
    })
  }
}
