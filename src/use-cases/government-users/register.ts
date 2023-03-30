import {
  GovernmentUser,
  GovernmentUsersRepository,
} from '@/repositories/government-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { EmailAlreadyRegisteredError } from '../errors/email-already-registered-error'
import { NotAllowedEmailError } from '../errors/not-allowed-email-error'

interface RegisterGovernmentUserUseCaseRequest {
  email: string
  password: string
}

interface RegisterGovernmentUserUseCaseResponse {
  governmentUser: GovernmentUser
}

export class RegisterGovernmentUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private governmentUsersRepository: GovernmentUsersRepository,
  ) {}

  async execute({
    email,
    password,
  }: RegisterGovernmentUserUseCaseRequest): Promise<RegisterGovernmentUserUseCaseResponse> {
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

    return { governmentUser }
  }
}
