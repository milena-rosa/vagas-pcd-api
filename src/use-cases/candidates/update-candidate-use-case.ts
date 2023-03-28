import { CandidatesRepository } from '@/repositories/candidates-repository'
import { Candidate } from '@prisma/client'
import { compare, hash } from 'bcryptjs'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface UpdateCandidateUseCaseRequest {
  id: string
  name?: string
  email?: string
  password?: string
  oldPassword?: string
  phone?: string | null
  resume?: string
}

interface UpdateCandidateUseCaseResponse {
  candidate: Candidate
}

export class UpdateCandidateUseCase {
  constructor(private candidatesRepository: CandidatesRepository) {}

  async execute({
    id,
    email,
    name,
    phone,
    resume,
    password,
    oldPassword,
  }: UpdateCandidateUseCaseRequest): Promise<UpdateCandidateUseCaseResponse> {
    const foundCandidate = await this.candidatesRepository.findById(id)
    if (!foundCandidate) {
      throw new ResourceNotFoundError()
    }

    if (password) {
      if (!oldPassword) {
        throw new InvalidCredentialsError()
      }

      const isOldPasswordCorrect = await compare(
        oldPassword,
        foundCandidate.password_hash,
      )
      if (!isOldPasswordCorrect) {
        throw new InvalidCredentialsError()
      }
    }
    const password_hash = password ? await hash(password, 6) : undefined

    const candidate = await this.candidatesRepository.update(id, {
      email,
      name,
      password_hash,
      phone,
      resume,
    })

    return { candidate }
  }
}
