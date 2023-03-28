import { prisma } from '@/libs/prisma'
import { Prisma } from '@prisma/client'
import { GovernmentUsersRepository } from '../government-users-repository'

export class PrismaGovernmentUsersRepository
  implements GovernmentUsersRepository
{
  async findById(id: string) {
    return await prisma.governmentUser.findUnique({ where: { id } })
  }

  async findByEmail(email: string) {
    return await prisma.governmentUser.findUnique({ where: { email } })
  }

  async create(data: Prisma.GovernmentUserCreateInput) {
    return await prisma.governmentUser.create({ data })
  }
}
