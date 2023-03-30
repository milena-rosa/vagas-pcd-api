import { CompanyApiData, cnpjApi } from '@/libs/axios'
import { prisma } from '@/libs/prisma'
import { Prisma } from '@prisma/client'
import { CompaniesRepository } from '../companies-repository'

export class PrismaCompaniesRepository implements CompaniesRepository {
  async findById(companyId: string) {
    return await prisma.company.findUnique({
      where: { company_id: companyId },
      include: { user: true },
    })
  }

  async findByCNPJ(cnpj: string) {
    return await prisma.company.findUnique({
      where: { cnpj },
      include: { user: true },
    })
  }

  async findAll() {
    return (await prisma.company.findMany({
      select: {
        jobs: {
          include: {
            _count: true,
            applications: {
              distinct: ['candidate_id'],
            },
          },
        },
      },
    })) as any
  }

  async create({ cnpj, user }: Prisma.CompanyCreateInput) {
    const { data } = await cnpjApi.get<CompanyApiData>(cnpj)

    return await prisma.company.create({
      data: {
        cnpj,
        name: data.razao_social,
        zipCode: data.cep,
        state: data.uf,
        city: data.municipio,
        street: data.logradouro,
        number: data.numero,
        complement: data.complemento,
        phone: data.ddd_telefone_1,
        user,
      },
      include: { user: true },
    })
  }
}
