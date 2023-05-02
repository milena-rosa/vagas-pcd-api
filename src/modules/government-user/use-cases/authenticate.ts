import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { GovernmentUsersRepository } from '@/repositories/government-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { compare } from 'bcryptjs'
import {
  AuthenticateGovernmentUserRequest,
  GovernmentUserProfileReply,
} from '../government-user.schema'

export class AuthenticateGovernmentUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private governmentUsersRepository: GovernmentUsersRepository,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateGovernmentUserRequest): Promise<{
    governmentUser: GovernmentUserProfileReply
  }> {
    const foundUser = await this.usersRepository.findByEmail(email)
    if (!foundUser) {
      throw new InvalidCredentialsError()
    }
    const doPasswordsMatch = await compare(password, foundUser.password_hash)
    if (!doPasswordsMatch) {
      throw new InvalidCredentialsError()
    }

    const foundGovernmentUser = await this.governmentUsersRepository.findById(
      foundUser.user_id,
    )
    if (!foundGovernmentUser) {
      throw new ResourceNotFoundError()
    }

    return {
      governmentUser: {
        user_id: foundUser.user_id,
        email,
        password_hash: foundUser.password_hash,
        created_at: foundGovernmentUser.user.created_at,
      },
    }
  }
}
