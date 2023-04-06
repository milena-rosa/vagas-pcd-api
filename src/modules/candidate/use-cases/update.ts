import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import {
  CandidateUser,
  CandidatesRepository,
} from '@/repositories/candidates-repository'
import { compare, hash } from 'bcryptjs'

interface UpdateCandidateUseCaseRequest {
  candidateId: string
  name?: string
  email?: string
  password?: string
  oldPassword?: string
  phone?: string | null
  resume?: string
}

interface UpdateCandidateUseCaseResponse {
  candidate: CandidateUser
}

export class UpdateCandidateUseCase {
  constructor(private candidatesRepository: CandidatesRepository) {}

  async execute({
    candidateId,
    email,
    name,
    phone,
    resume,
    password,
    oldPassword,
  }: UpdateCandidateUseCaseRequest): Promise<UpdateCandidateUseCaseResponse> {
    const foundCandidate = await this.candidatesRepository.findById(candidateId)
    if (!foundCandidate) {
      throw new ResourceNotFoundError()
    }

    if (password) {
      if (!oldPassword) {
        throw new InvalidCredentialsError()
      }

      const isOldPasswordCorrect = await compare(
        oldPassword,
        foundCandidate.user.password_hash,
      )
      if (!isOldPasswordCorrect) {
        throw new InvalidCredentialsError()
      }
    }
    const passwordHash = password ? await hash(password, 6) : undefined

    const candidate = await this.candidatesRepository.update(
      foundCandidate.candidate_id,
      {
        name,
        phone,
        resume,
        user: {
          update: {
            email,
            password_hash: passwordHash,
          },
        },
      },
    )

    return { candidate }
  }
}
