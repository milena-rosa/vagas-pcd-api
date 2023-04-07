import { EmailAlreadyRegisteredError } from '@/errors/email-already-registered-error'
import { NotAllowedEmailError } from '@/errors/not-allowed-email-error'
import { GovernmentUsersRepository } from '@/repositories/government-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import {
  CreateGovernmentUserInput,
  CreateGovernmentUserReply,
} from '../government-user.schema'

export class RegisterGovernmentUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private governmentUsersRepository: GovernmentUsersRepository,
  ) {}

  async execute({ email, password }: CreateGovernmentUserInput): Promise<{
    governmentUser: CreateGovernmentUserReply
  }> {
    if (!email.endsWith('gov.br')) {
      throw new NotAllowedEmailError()
    }

    const userWithSameEmail = await this.usersRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new EmailAlreadyRegisteredError()
    }

    const passwordHash = await hash(password, 6)

    const governmentUser = await this.governmentUsersRepository.create({
      user: {
        create: { email, password_hash: passwordHash, role: 'GOVERNMENT' },
      },
    })

    return {
      governmentUser: {
        user_id: governmentUser.user_id,
        email: governmentUser.user.email,
        password_hash: governmentUser.user.password_hash,
        created_at: governmentUser.user.created_at,
      },
    }
  }
}
