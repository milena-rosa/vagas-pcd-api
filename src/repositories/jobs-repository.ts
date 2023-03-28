import { DisabilityType, Job, Location, Prisma } from '@prisma/client'

export const DisabilityTypeDictionary = {
  [DisabilityType.ANY]: 'qualquer',
  [DisabilityType.HEARING]: 'audição',
  [DisabilityType.MENTAL]: 'mental',
  [DisabilityType.MULTIPLE]: 'múltipla',
  [DisabilityType.PHYSICAL]: 'física',
  [DisabilityType.VISUAL]: 'visual',
}

export const LocationDictionary = {
  [Location.HYBRID]: 'híbrido',
  [Location.ON_SITE]: 'presencial',
  [Location.REMOTE]: 'remoto',
}

export interface JobsRepository {
  findById(id: string): Promise<Job | null>
  findMany(query: string, page: number): Promise<Job[]>
  findManyByCompanyId(companyId: string, page: number): Promise<Job[]>
  findManyOpenByCompanyId(companyId: string, page: number): Promise<Job[]>
  create(data: Prisma.JobUncheckedCreateInput): Promise<Job>
  update(id: string, data: Prisma.JobUncheckedUpdateInput): Promise<Job>
}
