import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { CandidatesRepository } from '@/repositories/candidates-repository'
import { compare, hash } from 'bcryptjs'
import { UpdateCandidateInput, UpdateCandidateReply } from '../candidate.schema'

export class UpdateCandidateUseCase {
  constructor(private candidatesRepository: CandidatesRepository) {}

  async execute({
    candidate_id,
    email,
    name,
    phone,
    zipCode,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    linkedin,
    professionalExperience,
    educationalBackground,
    skills,
    password,
    oldPassword,
  }: UpdateCandidateInput): Promise<{ candidate: UpdateCandidateReply }> {
    const foundCandidate = await this.candidatesRepository.findById(
      candidate_id,
    )
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
        phone: phone ?? '',
        zipCode: zipCode ?? '',
        street: street ?? '',
        number: number ?? '',
        complement: complement ?? '',
        neighborhood: neighborhood ?? '',
        city: city ?? '',
        state: state ?? '',
        linkedin: linkedin ?? '',
        professionalExperience: professionalExperience ?? '',
        educationalBackground: educationalBackground ?? '',
        skills: skills ?? '',
        user: {
          update: {
            email,
            password_hash: passwordHash,
          },
        },
      },
    )

    return {
      candidate: {
        candidate_id: candidate.candidate_id,
        name: candidate.name,
        phone: candidate.phone,
        zipCode: candidate.zipCode,
        street: candidate.street,
        number: candidate.number,
        complement: candidate.complement,
        neighborhood: candidate.neighborhood,
        city: candidate.city,
        state: candidate.state,
        linkedin: candidate.linkedin,
        professionalExperience: candidate.professionalExperience,
        educationalBackground: candidate.educationalBackground,
        skills: candidate.skills,
        email: candidate.user.email,
        created_at: candidate.user.created_at,
        password_hash: candidate.user.password_hash,
      },
    }
  }
}
