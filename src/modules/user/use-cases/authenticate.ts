import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { compare } from 'bcryptjs'
import { AuthenticateRequest } from '../user.schema'

export class AuthenticateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateRequest): Promise<{ user: User }> {
    const foundUser = await this.usersRepository.findByEmail(email)
    if (!foundUser) {
      throw new InvalidCredentialsError()
    }

    const doPasswordsMatch = await compare(password, foundUser.password_hash)
    if (!doPasswordsMatch) {
      throw new InvalidCredentialsError()
    }

    return { user: foundUser }
  }
}
