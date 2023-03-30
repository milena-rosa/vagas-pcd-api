import { prisma } from '@/libs/prisma'
import { Prisma } from '@prisma/client'
import { GovernmentUsersRepository } from '../government-users-repository'

export class PrismaGovernmentUsersRepository
  implements GovernmentUsersRepository
{
  async findById(userId: string) {
    return await prisma.governmentUser.findUnique({
      where: { user_id: userId },
      include: { user: true },
    })
  }

  async create(data: Prisma.GovernmentUserCreateInput) {
    return await prisma.governmentUser.create({ data, include: { user: true } })
  }
}
