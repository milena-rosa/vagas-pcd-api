import { prisma } from '@/libs/prisma'
import { Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    return await prisma.user.findUnique({ where: { id } })
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } })
  }

  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({ data })
  }

  // async update(id: string, data: Prisma.CandidateUpdateInput) {
  //   return await prisma.candidate.update({
  //     where: { id },
  //     data,
  //   })
  // }
}
