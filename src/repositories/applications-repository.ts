import { Application, Prisma } from '@prisma/client'

export interface ApplicationsRepository {
  create(data: Prisma.ApplicationUncheckedCreateInput): Promise<Application>
}
