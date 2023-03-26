import { Address, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { AddressesRepository } from '../addresses-repository'

export class InMemoryAddressesRepository implements AddressesRepository {
  public addresses: Address[] = []

  async findByCompanyId(companyId: string) {
    const foundAddress = this.addresses.find(
      (address) => address.company_id === companyId,
    )
    return foundAddress || null
  }

  async create(data: Prisma.AddressUncheckedCreateInput) {
    const address: Address = {
      id: randomUUID(),
      ...data,
      complement: data.complement ?? null,
    }

    this.addresses.push(address)

    return address
  }
}
