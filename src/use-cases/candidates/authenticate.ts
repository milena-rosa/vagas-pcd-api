import { CandidatesRepository } from '@/repositories/candidates-repository'
import { Candidate } from '@prisma/client'
import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

interface AuthenticateCandidateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateCandidateUseCaseResponse {
  candidate: Candidate
}

export class AuthenticateCandidateUseCase {
  constructor(private candidatesRepository: CandidatesRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateCandidateUseCaseRequest): Promise<AuthenticateCandidateUseCaseResponse> {
    const foundCandidate = await this.candidatesRepository.findByEmail(email)
    if (!foundCandidate) {
      throw new InvalidCredentialsError()
    }

    const doPasswordsMatch = await compare(
      password,
      foundCandidate.password_hash,
    )
    if (!doPasswordsMatch) {
      throw new InvalidCredentialsError()
    }

    return { candidate: foundCandidate }
  }
}
