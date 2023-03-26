import { CandidatesRepository } from '@/repositories/candidates-repository'
import { Candidate } from '@prisma/client'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface UpdateCandidateUseCaseRequest {
  id: string
  name?: string
  email?: string
  password?: string
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
    password,
    phone,
    resume,
  }: UpdateCandidateUseCaseRequest): Promise<UpdateCandidateUseCaseResponse> {
    const foundCandidate = await this.candidatesRepository.findById(id)
    if (!foundCandidate) {
      throw new ResourceNotFoundError()
    }

    const candidate = await this.candidatesRepository.update(id, {
      email,
      name,
      password_hash: password ? await hash(password, 6) : undefined,
      phone,
      resume,
    })

    return { candidate }
  }
}
