import { GovernmentUser, Prisma } from '@prisma/client'

export interface GovernmentUsersRepository {
  findById(id: string): Promise<GovernmentUser | null>
  findByEmail(email: string): Promise<GovernmentUser | null>
  create(data: Prisma.GovernmentUserCreateInput): Promise<GovernmentUser>
}
