import { app } from '@/app'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('company profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get company profile', async () => {
    const registerResponse = await request(app.server).post('/companies').send({
      cnpj: '23.243.199/0001-84',
      email: 'lojasponei@example.com',
      password: '123456',
    })

    const { company_id } = registerResponse.body

    const profileResponse = await request(app.server)
      .get(`/companies/profile`)
      .query({ company_id })
      .send()

    expect(profileResponse.statusCode).toEqual(OK)
    expect(profileResponse.body).toEqual(
      expect.objectContaining({
        cnpj: '23.243.199/0001-84',
        email: 'lojasponei@example.com',
      }),
    )
  })
})
