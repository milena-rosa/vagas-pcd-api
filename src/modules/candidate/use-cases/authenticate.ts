import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { CandidatesRepository } from '@/repositories/candidates-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { compare } from 'bcryptjs'
import {
  AuthenticateCandidateRequest,
  GetCandidateProfileReply,
} from '../candidate.schema'

export class AuthenticateCandidateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private candidatesRepository: CandidatesRepository,
  ) {}

  async execute({ email, password }: AuthenticateCandidateRequest): Promise<{
    candidate: GetCandidateProfileReply
  }> {
    const foundUser = await this.usersRepository.findByEmail(email)
    if (!foundUser) {
      throw new InvalidCredentialsError()
    }
    const doPasswordsMatch = await compare(password, foundUser.password_hash)
    if (!doPasswordsMatch) {
      throw new InvalidCredentialsError()
    }

    const foundCandidate = await this.candidatesRepository.findById(
      foundUser.user_id,
    )
    if (!foundCandidate) {
      throw new ResourceNotFoundError()
    }

    return {
      candidate: {
        candidate_id: foundUser.user_id,
        name: foundCandidate.name,
        email,
        phone: foundCandidate.phone,
        zipCode: foundCandidate.zipCode,
        street: foundCandidate.street,
        number: foundCandidate.number,
        complement: foundCandidate.complement,
        neighborhood: foundCandidate.neighborhood,
        city: foundCandidate.city,
        state: foundCandidate.state,
        linkedin: foundCandidate.linkedin,
        professionalExperience: foundCandidate.professionalExperience,
        educationalBackground: foundCandidate.educationalBackground,
        skills: foundCandidate.skills,
        created_at: foundCandidate.user.created_at,
        password_hash: foundUser.password_hash,
      },
    }
  }
}
