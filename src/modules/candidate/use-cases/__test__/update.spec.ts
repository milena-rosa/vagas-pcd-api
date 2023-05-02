import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/libs/__mocks__/prisma'
import {
  CandidateUser,
  CandidatesRepository,
} from '@/repositories/candidates-repository'
import { PrismaCandidatesRepository } from '@/repositories/prisma/prisma-candidates-repository'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { UpdateCandidateUseCase } from '../update'

let candidatesRepository: CandidatesRepository
let sut: UpdateCandidateUseCase

vi.mock('@/libs/prisma')

describe('update candidate use case', () => {
  beforeEach(() => {
    candidatesRepository = new PrismaCandidatesRepository()
    sut = new UpdateCandidateUseCase(candidatesRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to update the name of a candidate given a correct id', async () => {
    const mockUser: User = {
      user_id: randomUUID(),
      email: 'janedoe@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCandidate = {
      candidate_id: mockUser.user_id,
      name: 'Jane Doe',
      phone: '(77) 939014245',
      zipCode: '45007-605',
      street: 'Rua Padre Gilberto Vaz Sampaio',
      number: '933',
      complement: '',
      neighborhood: 'Lagoa das Flores',
      city: 'Vitória da Conquista',
      state: 'BA',
      linkedin: 'https://linkedin.com/in/jane-doe',
      professionalExperience: '',
      educationalBackground: '',
      skills: '',
      user: mockUser,
    }

    prisma.candidate.findUnique.mockResolvedValueOnce(mockCandidate)
    prisma.candidate.update.mockResolvedValueOnce({
      ...mockCandidate,
      name: 'Joana Doe',
    })

    const { candidate } = await sut.execute({
      candidate_id: mockCandidate.candidate_id,
      name: 'Joana Doe',
      educationalBackground: '',
      linkedin: '',
      professionalExperience: '',
      skills: '',
    })

    expect(candidate).toStrictEqual({
      candidate_id: mockCandidate.candidate_id,
      phone: mockCandidate.phone,
      zipCode: mockCandidate.zipCode,
      street: mockCandidate.street,
      number: mockCandidate.number,
      complement: mockCandidate.complement,
      neighborhood: mockCandidate.neighborhood,
      city: mockCandidate.city,
      state: mockCandidate.state,
      linkedin: mockCandidate.linkedin,
      professionalExperience: mockCandidate.professionalExperience,
      educationalBackground: mockCandidate.educationalBackground,
      skills: mockCandidate.skills,
      email: mockCandidate.user.email,
      created_at: mockCandidate.user.created_at,
      password_hash: mockCandidate.user.password_hash,
      name: 'Joana Doe',
    })
  })

  it('should not be able to change the password if the old password is not correct', async () => {
    const mockUser: User = {
      user_id: randomUUID(),
      email: 'janedoe@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCandidate = {
      candidate_id: mockUser.user_id,
      name: 'Jane Doe',
      phone: '(77) 939014245',
      zipCode: '45007-605',
      street: 'Rua Padre Gilberto Vaz Sampaio',
      number: '933',
      complement: '',
      neighborhood: 'Lagoa das Flores',
      city: 'Vitória da Conquista',
      state: 'BA',
      linkedin: 'https://linkedin.com/in/jane-doe',
      professionalExperience: '',
      educationalBackground: '',
      skills: '',
      user: mockUser,
    }

    prisma.candidate.findUnique.mockResolvedValueOnce(mockCandidate)

    await expect(() =>
      sut.execute({
        candidate_id: mockCandidate.candidate_id,
        oldPassword: 'wrong-password',
        password: '654321',
        educationalBackground: '',
        linkedin: '',
        professionalExperience: '',
        skills: '',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to change the password if the old password is not sent', async () => {
    const mockUser: User = {
      user_id: randomUUID(),
      email: 'janedoe@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCandidate = {
      candidate_id: mockUser.user_id,
      name: 'Jane Doe',
      phone: '(77) 939014245',
      zipCode: '45007-605',
      street: 'Rua Padre Gilberto Vaz Sampaio',
      number: '933',
      complement: '',
      neighborhood: 'Lagoa das Flores',
      city: 'Vitória da Conquista',
      state: 'BA',
      linkedin: 'https://linkedin.com/in/jane-doe',
      professionalExperience: '',
      educationalBackground: '',
      skills: '',
      user: mockUser,
    }

    prisma.candidate.findUnique.mockResolvedValueOnce(mockCandidate)

    await expect(() =>
      sut.execute({
        candidate_id: mockCandidate.candidate_id,
        password: 'new-password',
        educationalBackground: '',
        linkedin: '',
        professionalExperience: '',
        skills: '',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be able to change the password given a correct id and the old password correctly', async () => {
    const mockUser: User = {
      user_id: randomUUID(),
      email: 'janedoe@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCandidate = {
      candidate_id: mockUser.user_id,
      name: 'Jane Doe',
      phone: '(77) 939014245',
      zipCode: '45007-605',
      street: 'Rua Padre Gilberto Vaz Sampaio',
      number: '933',
      complement: '',
      neighborhood: 'Lagoa das Flores',
      city: 'Vitória da Conquista',
      state: 'BA',
      linkedin: 'https://linkedin.com/in/jane-doe',
      professionalExperience: '',
      educationalBackground: '',
      skills: '',
      user: mockUser,
    }

    const newPasswordHash = await hash('654321', 6)

    const mockUpdatedUser: User = {
      ...mockUser,
      password_hash: newPasswordHash,
    }

    const mockCandidateUpdated: CandidateUser = {
      ...mockCandidate,
      user: mockUpdatedUser,
    }

    prisma.candidate.findUnique.mockResolvedValueOnce(mockCandidate)
    prisma.user.update.mockResolvedValueOnce(mockUpdatedUser)
    prisma.candidate.update.mockResolvedValueOnce(mockCandidateUpdated)

    const { candidate } = await sut.execute({
      candidate_id: mockCandidate.candidate_id,
      oldPassword: '123456',
      password: '654321',
      educationalBackground: '',
      linkedin: '',
      professionalExperience: '',
      skills: '',
    })

    expect(candidate).toStrictEqual({
      candidate_id: mockCandidateUpdated.candidate_id,
      name: mockCandidateUpdated.name,
      phone: mockCandidateUpdated.phone,
      zipCode: mockCandidate.zipCode,
      street: mockCandidate.street,
      number: mockCandidate.number,
      complement: mockCandidate.complement,
      neighborhood: mockCandidate.neighborhood,
      city: mockCandidate.city,
      state: mockCandidate.state,
      linkedin: mockCandidate.linkedin,
      professionalExperience: mockCandidate.professionalExperience,
      educationalBackground: mockCandidate.educationalBackground,
      skills: mockCandidate.skills,
      email: mockCandidateUpdated.user.email,
      created_at: mockCandidateUpdated.user.created_at,
      password_hash: mockCandidateUpdated.user.password_hash,
    })
  })

  it('should not be able to update the name of a candidate given a correct id if the name is undefined', async () => {
    const mockUser: User = {
      user_id: randomUUID(),
      email: 'janedoe@example.com',
      role: 'CANDIDATE',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    const mockCandidate = {
      candidate_id: mockUser.user_id,
      name: 'Jane Doe',
      phone: '(77) 939014245',
      zipCode: '45007-605',
      street: 'Rua Padre Gilberto Vaz Sampaio',
      number: '933',
      complement: '',
      neighborhood: 'Lagoa das Flores',
      city: 'Vitória da Conquista',
      state: 'BA',
      linkedin: 'https://linkedin.com/in/jane-doe',
      professionalExperience: '',
      educationalBackground: '',
      skills: '',
      user: mockUser,
    }

    prisma.candidate.findUnique.mockResolvedValueOnce(mockCandidate)
    prisma.candidate.update.mockResolvedValueOnce(mockCandidate)

    const { candidate } = await sut.execute({
      candidate_id: mockCandidate.candidate_id,
      name: undefined,
      educationalBackground: '',
      linkedin: '',
      professionalExperience: '',
      skills: '',
    })

    expect(candidate).toStrictEqual({
      candidate_id: mockCandidate.candidate_id,
      name: mockCandidate.name,
      phone: mockCandidate.phone,
      zipCode: mockCandidate.zipCode,
      street: mockCandidate.street,
      number: mockCandidate.number,
      complement: mockCandidate.complement,
      neighborhood: mockCandidate.neighborhood,
      city: mockCandidate.city,
      state: mockCandidate.state,
      linkedin: mockCandidate.linkedin,
      professionalExperience: mockCandidate.professionalExperience,
      educationalBackground: mockCandidate.educationalBackground,
      skills: mockCandidate.skills,
      email: mockCandidate.user.email,
      created_at: mockCandidate.user.created_at,
      password_hash: mockCandidate.user.password_hash,
    })
  })

  it('should not be able to update the name of a candidate given an incorrect id', async () => {
    prisma.candidate.update.mockRejectedValueOnce(new ResourceNotFoundError())

    await expect(() =>
      sut.execute({
        candidate_id: 'non-existent-user-id',
        name: 'Joana Doe',
        educationalBackground: '',
        linkedin: '',
        professionalExperience: '',
        skills: '',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
