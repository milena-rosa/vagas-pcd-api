import { prisma } from '@/libs/prisma'
import { Prisma } from '@prisma/client'
import { CandidatesRepository } from '../candidates-repository'

export class PrismaCandidatesRepository implements CandidatesRepository {
  async findById(candidateId: string) {
    return await prisma.candidate.findUnique({
      where: { candidate_id: candidateId },
      include: { user: true },
    })
  }

  async findManyByJobId(jobId: string, page: number) {
    return await prisma.candidate.findMany({
      where: { applications: { every: { job_id: jobId } } },
      include: { user: true },
      take: 20,
      skip: (page - 1) * 20,
    })
  }

  async create(data: Prisma.CandidateCreateInput) {
    return await prisma.candidate.create({ data, include: { user: true } })
  }

  async update(candidateId: string, data: Prisma.CandidateUpdateInput) {
    return await prisma.candidate.update({
      where: { candidate_id: candidateId },
      data,
      include: { user: true },
    })
  }
}
