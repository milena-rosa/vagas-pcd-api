import { CandidatesRepository } from '@/repositories/candidates-repository'
import { Candidate } from '@prisma/client'
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
  candidate: Candidate
}

export class RegisterCandidateUseCase {
  constructor(private candidatesRepository: CandidatesRepository) {}

  async execute({
    email,
    name,
    password,
    phone,
    resume,
  }: RegisterCandidateUseCaseRequest): Promise<RegisterCandidateUseCaseResponse> {
    const candidateWithSameEmail = await this.candidatesRepository.findByEmail(
      email,
    )
    if (candidateWithSameEmail) {
      throw new EmailAlreadyRegisteredError()
    }

    const password_hash = await hash(password, 6)

    const candidate = await this.candidatesRepository.create({
      name,
      email,
      phone,
      resume,
      password_hash,
    })

    return { candidate }
  }
}
