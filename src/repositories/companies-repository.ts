import { Prisma } from '@prisma/client'

const companyUser = Prisma.validator<Prisma.CompanyArgs>()({
  include: { user: true },
})

export type CompanyUser = Prisma.CompanyGetPayload<typeof companyUser>

export interface CompaniesRepository {
  findById(companyId: string): Promise<CompanyUser | null>
  findByCNPJ(cnpj: string): Promise<CompanyUser | null>
  findAll(): Promise<CompanyUser>
  create(data: Prisma.CompanyCreateInput): Promise<CompanyUser>
}
