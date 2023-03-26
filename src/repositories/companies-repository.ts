import { Company, Prisma } from '@prisma/client'

export interface CompaniesRepository {
  create(data: Prisma.CompanyUncheckedCreateInput): Promise<Company>
}
