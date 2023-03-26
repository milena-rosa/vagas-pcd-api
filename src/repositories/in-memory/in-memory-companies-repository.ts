import { Company, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { CompaniesRepository } from '../companies-repository'

export class InMemoryCompaniesRepository implements CompaniesRepository {
  public companies: Company[] = []

  async findByCNPJ(cnpj: string) {
    const foundCompany = this.companies.find((company) => company.cnpj === cnpj)
    return foundCompany ?? null
  }

  async findByEmail(email: string) {
    const foundCompany = this.companies.find(
      (company) => company.email === email,
    )
    return foundCompany ?? null
  }

  async create(data: Prisma.CompanyUncheckedCreateInput) {
    const company: Company = {
      id: randomUUID(),
      cnpj: data.cnpj,
      email: data.email,
      password_hash: data.password_hash,
    }

    console.log(company)
    this.companies.push(company)

    return company
  }
}
