import { EmailAlreadyRegisteredError } from '@/errors/email-already-registered-error'
import { CandidatesRepository } from '@/repositories/candidates-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { CreateCandidateInput, CreateCandidateReply } from '../candidate.schema'

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
  }: CreateCandidateInput): Promise<{ candidate: CreateCandidateReply }> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new EmailAlreadyRegisteredError()
    }

    const passwordHash = await hash(password, 6)

    const candidate = await this.candidatesRepository.create({
      name,
      phone,
      resume: resume ?? '',
      user: {
        create: {
          email,
          password_hash: passwordHash,
          role: 'CANDIDATE',
        },
      },
    })

    return {
      candidate: {
        candidate_id: candidate.candidate_id,
        name: candidate.name,
        phone: candidate.phone,
        resume: candidate.resume,
        email: candidate.user.email,
        created_at: candidate.user.created_at,
        password_hash: candidate.user.password_hash,
      },
    }
  }
}
