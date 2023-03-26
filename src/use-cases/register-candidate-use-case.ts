import { CandidatesRepository } from '@/repositories/candidates-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { Candidate } from '@prisma/client'
import { hash } from 'bcryptjs'
import { EmailAlreadyRegisteredError } from './errors/email-already-registered-error'

interface RegisterCandidateUseCaseRequest {
  name: string
  email: string
  password: string
  phone: string | null
  resume: string
}

interface RegisterCandidateUseCaseResponse {
  candidate: Candidate
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

    const user = await this.usersRepository.create({
      email,
      name,
      password_hash,
      phone,
    })

    const candidate = await this.candidatesRepository.create({
      resume,
      user_id: user.id,
    })

    return { candidate }
  }
}
