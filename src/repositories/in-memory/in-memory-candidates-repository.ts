import { Candidate, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { CandidatesRepository } from '../candidates-repository'

export class InMemoryCandidatesRepository implements CandidatesRepository {
  public candidates: Candidate[] = []

  async findById(id: string) {
    return this.candidates.find((candidate) => candidate.id === id) || null
  }

  async findByEmail(email: string) {
    return (
      this.candidates.find((candidate) => candidate.email === email) || null
    )
  }

  async create(data: Prisma.CandidateUncheckedCreateInput) {
    const newCandidate: Candidate = {
      id: randomUUID(),
      resume: data.resume,
      email: data.email,
      name: data.name,
      phone: data.phone || null,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.candidates.push(newCandidate)

    return newCandidate
  }
}
