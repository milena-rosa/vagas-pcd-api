import { prisma } from '@/libs/prisma'
import { Prisma } from '@prisma/client'
import { CompaniesRepository } from '../companies-repository'

export class PrismaCompaniesRepository implements CompaniesRepository {
  async findByCNPJ(cnpj: string) {
    return await prisma.company.findUnique({ where: { cnpj } })
  }

  async findByEmail(email: string) {
    return await prisma.company.findUnique({ where: { email } })
  }

  async create(data: Prisma.CompanyUncheckedCreateInput) {
    return await prisma.company.create({ data })
  }
}
