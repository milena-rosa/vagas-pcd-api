import { GovernmentUsersRepository } from '@/repositories/government-users-repository'
import { GovernmentUser } from '@prisma/client'
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
  constructor(private governmentUsersRepository: GovernmentUsersRepository) {}

  async execute({
    email,
    password,
  }: RegisterGovernmentUserUseCaseRequest): Promise<RegisterGovernmentUserUseCaseResponse> {
    const userWithSameEmail = await this.governmentUsersRepository.findByEmail(
      email,
    )
    if (userWithSameEmail) {
      throw new EmailAlreadyRegisteredError()
    }

    const password_hash = await hash(password, 6)

    const governmentUser = await this.governmentUsersRepository.create({
      email,
      password_hash,
    })

    return { governmentUser }
  }
}
