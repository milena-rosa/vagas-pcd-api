import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { UsersRepository } from '@/repositories/users-repository'
import {
  GetGovernmentUserProfileInput,
  GovernmentUserProfileReply,
} from '../government-user.schema'

export class GetGovernmentUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ user_id }: GetGovernmentUserProfileInput): Promise<{
    governmentUser: GovernmentUserProfileReply
  }> {
    const foundUser = await this.usersRepository.findById(user_id)
    if (!foundUser) {
      throw new ResourceNotFoundError()
    }

    return {
      governmentUser: {
        user_id: foundUser.user_id,
        email: foundUser.email,
        created_at: foundUser.created_at,
        password_hash: foundUser.password_hash,
      },
    }
  }
}
