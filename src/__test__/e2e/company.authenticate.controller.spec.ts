import { server } from '@/app'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('company authenticate (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be able to authenticate a company', async () => {
    await request(server.server).post('/companies').send({
      cnpj: '23.243.199/0001-84',
      email: 'lojasponei@example.com',
      password: '123456',
    })

    const response = await request(server.server)
      .post('/companies/sessions')
      .send({
        email: 'lojasponei@example.com',
        password: '123456',
      })

    expect(response.statusCode).toStrictEqual(OK)
    expect(response.body).toEqual({
      token: expect.any(String),
      company: expect.objectContaining({
        cnpj: '23.243.199/0001-84',
        email: 'lojasponei@example.com',
      }),
    })
  })
})
