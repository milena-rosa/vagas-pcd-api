import { prisma } from '@/libs/prisma'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findById(userId: string) {
    return await prisma.user.findUnique({ where: { user_id: userId } })
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } })
  }
}
