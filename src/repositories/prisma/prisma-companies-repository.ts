import { cnpjApi } from '@/libs/axios'
import { prisma } from '@/libs/prisma'
import { Prisma } from '@prisma/client'
import { CompaniesRepository, CompanyData } from '../companies-repository'

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

  async show(cnpj: string, email: string) {
    const { data } = await cnpjApi.get(cnpj)
    return {
      name: data.razao_social,
      email,
      zipCode: data.cep,
      state: data.uf,
      city: data.municipio,
      street: data.logradouro,
      number: data.numero,
      complement: data.complemento,
      phone: data.ddd_telefone_1,
    } as CompanyData
  }
}
