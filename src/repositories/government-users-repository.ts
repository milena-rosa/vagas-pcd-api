import { Prisma } from '@prisma/client'

const governmentUser = Prisma.validator<Prisma.GovernmentUserArgs>()({
  include: { user: true },
})

export type GovernmentUser = Prisma.GovernmentUserGetPayload<
  typeof governmentUser
>

export interface GovernmentUsersRepository {
  findById(userId: string): Promise<GovernmentUser | null>
  create(data: Prisma.GovernmentUserCreateInput): Promise<GovernmentUser>
}
