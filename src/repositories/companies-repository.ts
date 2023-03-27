import { Company, Prisma } from '@prisma/client'

export interface CompanyData {
  name: string
  email: string
  phone: string
  street: string
  zipCode: string
  number: string
  complement: string
  city: string
  state: string
}

export interface CompaniesRepository {
  findByCNPJ(cnpj: string): Promise<Company | null>
  findByEmail(email: string): Promise<Company | null>
  create(data: Prisma.CompanyUncheckedCreateInput): Promise<Company>
  show(cnpj: string, email: string): Promise<CompanyData>
}
