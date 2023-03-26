import { Address, Prisma } from '@prisma/client'

export interface AddressesRepository {
  findByCompanyId(companyId: string): Promise<Address | null>
  create(data: Prisma.AddressUncheckedCreateInput): Promise<Address>
}
