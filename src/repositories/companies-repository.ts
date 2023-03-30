import { Prisma } from '@prisma/client'

export interface SummaryReport {
  name: string
  cnpj: string
  email: string
  phone: string
  street: string
  number: string
  complement?: string
  city: string
  state: string
  zipCode: string
  countJobs: number
  countApplications: number
}

const companyUser = Prisma.validator<Prisma.CompanyArgs>()({
  include: { user: true },
})

export type CompanyUser = Prisma.CompanyGetPayload<typeof companyUser>

export interface CompaniesRepository {
  findByUserId(userId: string): Promise<CompanyUser | null>
  findByCNPJ(cnpj: string): Promise<CompanyUser | null>
  findAll(): Promise<CompanyUser>
  create(data: Prisma.CompanyCreateInput): Promise<CompanyUser>
}
