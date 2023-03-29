import { app } from '@/app'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('authenticate candidate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()

    await request(app.server).post('/companies').send({
      cnpj: '23.243.199/0001-84',
      email: 'lojasponei@example.com',
      password: '123456',
    })
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate a company with email', async () => {
    const response = await request(app.server)
      .post('/companies/sessions')
      .send({
        emailOrCnpj: 'lojasponei@example.com',
        password: '123456',
      })

    expect(response.statusCode).toEqual(OK)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })

  it('should be able to authenticate a company with cnpj', async () => {
    const response = await request(app.server)
      .post('/companies/sessions')
      .send({
        emailOrCnpj: '23.243.199/0001-84',
        password: '123456',
      })

    expect(response.statusCode).toEqual(OK)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
