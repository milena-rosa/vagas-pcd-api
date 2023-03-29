import {
  CandidateUser,
  CandidatesRepository,
} from '@/repositories/candidates-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { EmailAlreadyRegisteredError } from '../errors/email-already-registered-error'

interface RegisterCandidateUseCaseRequest {
  name: string
  email: string
  password: string
  phone: string | null
  resume: string
}

interface RegisterCandidateUseCaseResponse {
  candidate: CandidateUser
}

export class RegisterCandidateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private candidatesRepository: CandidatesRepository,
  ) {}

  async execute({
    email,
    name,
    password,
    phone,
    resume,
  }: RegisterCandidateUseCaseRequest): Promise<RegisterCandidateUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new EmailAlreadyRegisteredError()
    }

    const password_hash = await hash(password, 6)

    const candidate = await this.candidatesRepository.create({
      name,
      phone,
      resume,
      user: {
        create: {
          email,
          password_hash,
          role: 'CANDIDATE',
        },
      },
    })

    return {
      candidate,
    }
  }
}
