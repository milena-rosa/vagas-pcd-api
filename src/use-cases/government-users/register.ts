import {
  GovernmentUser,
  GovernmentUsersRepository,
} from '@/repositories/government-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { EmailAlreadyRegisteredError } from '../errors/email-already-registered-error'

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
    const userWithSameEmail = await this.usersRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new EmailAlreadyRegisteredError()
    }

    const password_hash = await hash(password, 6)

    const governmentUser = await this.governmentUsersRepository.create({
      user: { create: { email, password_hash } },
    })

    return { governmentUser }
  }
}
