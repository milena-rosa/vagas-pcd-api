import { prisma } from '@/libs/prisma'
import { Prisma } from '@prisma/client'
import { CandidatesRepository } from '../candidates-repository'

export class PrismaCandidatesRepository implements CandidatesRepository {
  async findById(id: string) {
    return await prisma.candidate.findUnique({ where: { id } })
  }

  async findByEmail(email: string) {
    return await prisma.candidate.findUnique({ where: { email } })
  }

  async create(data: Prisma.CandidateCreateInput) {
    return await prisma.candidate.create({ data })
  }

  async update(id: string, data: Prisma.CandidateUpdateInput) {
    return await prisma.candidate.update({
      where: { id },
      data,
    })
  }
}
