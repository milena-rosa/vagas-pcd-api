import { Company, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { CompaniesRepository } from '../companies-repository'

export class InMemoryCompaniesRepository implements CompaniesRepository {
  public companies: Company[] = []

  async create(data: Prisma.CompanyUncheckedCreateInput) {
    const company: Company = {
      id: randomUUID(),
      cnpj: data.cnpj,
      user_id: data.user_id,
    }

    this.companies.push(company)

    return company
  }
}
