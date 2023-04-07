import { server } from '@/app'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('get company profile (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be able to get company profile', async () => {
    const registerResponse = await request(server.server)
      .post('/companies')
      .send({
        cnpj: '23.243.199/0001-84',
        email: 'lojasponei@example.com',
        password: '123456',
      })

    const { company_id } = registerResponse.body

    const profileResponse = await request(server.server)
      .get(`/companies/${company_id}`)
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
