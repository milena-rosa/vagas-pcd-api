import { Candidate, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { CandidatesRepository } from '../candidates-repository'

export class InMemoryCandidatesRepository implements CandidatesRepository {
  public candidates: Candidate[] = []

  async findByEmail(email: string) {
    const candidate = this.candidates.find((item) => item.email)
    return candidate || null
  }

  async create(data: Prisma.CandidateUncheckedCreateInput) {
    const candidate: Candidate = {
      id: randomUUID(),
      resume: data.resume,
      email: data.email,
      name: data.name,
      phone: data.phone || null,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.candidates.push(candidate)

    return candidate
  }
}
