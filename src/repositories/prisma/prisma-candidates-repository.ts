import { prisma } from '@/libs/prisma'
import { Prisma } from '@prisma/client'
import { CandidatesRepository } from '../candidates-repository'

export class PrismaCandidatesRepository implements CandidatesRepository {
  async findByEmail(email: string) {
    return await prisma.candidate.findUnique({ where: { email } })
  }

  async create(data: Prisma.CandidateCreateInput) {
    return await prisma.candidate.create({ data })
  }
}
