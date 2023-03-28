import { GovernmentUsersRepository } from '@/repositories/government-users-repository'
import { GovernmentUser } from '@prisma/client'
import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

interface AuthenticateGovernmentUserUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateGovernmentUserUseCaseResponse {
  governmentUser: GovernmentUser
}

export class AuthenticateGovernmentUserUseCase {
  constructor(private governmentUsersRepository: GovernmentUsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateGovernmentUserUseCaseRequest): Promise<AuthenticateGovernmentUserUseCaseResponse> {
    const foundUser = await this.governmentUsersRepository.findByEmail(email)
    if (!foundUser) {
      throw new InvalidCredentialsError()
    }

    const doPasswordsMatch = await compare(password, foundUser.password_hash)
    if (!doPasswordsMatch) {
      throw new InvalidCredentialsError()
    }

    return { governmentUser: foundUser }
  }
}
