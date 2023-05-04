import { server } from '@/app'
import { CREATED } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('register company (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be able to register a company', async () => {
    const response = await request(server.server).post('/companies').send({
      cnpj: '23.243.199/0001-84',
      linkedin: 'https://www.linkedin.com/company/lojasponei/',
      about: 'Lojas Ponei é uma empresa massinha.',
      email: 'lojasponei@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(CREATED)
    expect(response.body).toEqual(
      expect.objectContaining({
        company_id: expect.any(String),
      }),
    )
  })
})
