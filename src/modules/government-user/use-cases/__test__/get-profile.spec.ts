import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/libs/__mocks__/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { Role } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GetGovernmentUserProfileUseCase } from '../get-profile'

let usersRepository: UsersRepository
let sut: GetGovernmentUserProfileUseCase

vi.mock('@/libs/prisma')

describe('get government user profile use case', () => {
  beforeEach(() => {
    usersRepository = new PrismaUsersRepository()
    sut = new GetGovernmentUserProfileUseCase(usersRepository)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to get a government user profile', async () => {
    const mockUser = {
      user_id: randomUUID(),
      email: 'inss@gov.br',
      role: Role.GOVERNMENT,
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    prisma.user.findUnique.mockResolvedValueOnce(mockUser)

    const { governmentUser } = await sut.execute({
      user_id: mockUser.user_id,
    })

    expect(governmentUser).toStrictEqual(
      expect.objectContaining({
        user_id: expect.any(String),
        email: mockUser.email,
      }),
    )
  })

  it('should not be able to get a government user profile with a wrong id', async () => {
    await expect(() =>
      sut.execute({
        user_id: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
