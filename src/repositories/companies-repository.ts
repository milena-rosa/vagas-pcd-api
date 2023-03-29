import { Company, Prisma } from '@prisma/client'

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

export interface CompaniesRepository {
  findByCNPJ(cnpj: string): Promise<Company | null>
  findByEmail(email: string): Promise<Company | null>
  findAll(): Promise<Company>
  create(data: Prisma.CompanyUncheckedCreateInput): Promise<any>
}
