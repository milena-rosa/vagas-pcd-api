import { Prisma, User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async findByEmail(email: string) {
    const foundUser = this.users.find((user) => user.email === email)
    return foundUser ?? null
  }

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: data.id ?? randomUUID(),
      name: data.name ?? 'Jane Doe',
      email: data.email ?? 'janedoe@example.com',
      password_hash: data.password_hash ?? (await hash('123456', 6)),
      phone: null,
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }
}
