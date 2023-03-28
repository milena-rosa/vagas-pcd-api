import { prisma } from '@/libs/prisma'
import { DisabilityType, Location, Prisma } from '@prisma/client'
import {
  DisabilityTypeDictionary,
  JobsRepository,
  LocationDictionary,
} from '../jobs-repository'

export class PrismaJobsRepository implements JobsRepository {
  async findById(id: string) {
    return await prisma.job.findUnique({ where: { id } })
  }

  async findMany(query: string, page: number) {
    const disability_type = Object.keys(DisabilityTypeDictionary).find((key) =>
      DisabilityTypeDictionary[key as DisabilityType]
        .toLowerCase()
        .includes(query.toLowerCase()),
    ) as DisabilityType | undefined

    const location = Object.keys(LocationDictionary).find((key) =>
      LocationDictionary[key as Location]
        .toLowerCase()
        .includes(query.toLowerCase()),
    ) as Location | undefined

    return await prisma.job.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { disability_type: { equals: disability_type } },
          { location: { equals: location } },
          { role: { contains: query, mode: 'insensitive' } },
          {
            company: {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { city: { contains: query, mode: 'insensitive' } },
              ],
            },
          },
        ],
      },
      take: 20,
      skip: (page - 1) * 20,
      include: {
        company: true,
      },
    })
  }

  async findManyOpenByCompanyId(companyId: string, page: number) {
    return await prisma.job.findMany({
      where: { company_id: companyId, closed_at: null },
      orderBy: {
        created_at: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })
  }

  async findManyByCompanyId(companyId: string, page = 1) {
    return await prisma.job.findMany({
      where: { company_id: companyId },
      orderBy: {
        created_at: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })
  }

  async create(data: Prisma.JobUncheckedCreateInput) {
    return await prisma.job.create({ data })
  }

  async update(id: string, data: Prisma.JobUncheckedUpdateInput) {
    return await prisma.job.update({
      where: { id },
      data,
    })
  }
}
