import { Company, Prisma } from '@prisma/client'

export interface CompaniesRepository {
  findByCNPJ(cnpj: string): Promise<Company | null>
  findByEmail(email: string): Promise<Company | null>
  create(data: Prisma.CompanyUncheckedCreateInput): Promise<Company>
}
