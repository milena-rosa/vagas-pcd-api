import { server } from '@/app'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('user controller (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be able to authenticate a candidate', async () => {
    await request(server.server).post('/candidates').send({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      phone: '11999222333',
      resume: 'https://linkedin.com/in/jane-doe',
      password: '123456',
    })

    const response = await request(server.server).post('/sessions').send({
      email: 'janedoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toStrictEqual(OK)
    expect(response.body).toStrictEqual({
      token: expect.any(String),
    })
  })

  it('should be able to authenticate a company', async () => {
    await request(server.server).post('/companies').send({
      cnpj: '23.243.199/0001-84',
      email: 'lojasponei@example.com',
      password: '123456',
    })

    const response = await request(server.server).post('/sessions').send({
      email: 'lojasponei@example.com',
      password: '123456',
    })

    expect(response.statusCode).toStrictEqual(OK)
    expect(response.body).toStrictEqual({
      token: expect.any(String),
    })
  })

  it('should be able to authenticate a company', async () => {
    await request(server.server).post('/government-users').send({
      email: 'inss@gov.br',
      password: '123456',
    })

    const response = await request(server.server).post('/sessions').send({
      email: 'inss@gov.br',
      password: '123456',
    })

    expect(response.statusCode).toStrictEqual(OK)
    expect(response.body).toStrictEqual({
      token: expect.any(String),
    })
  })

  it('should be able to refresh a token', async () => {
    await request(server.server).post('/candidates').send({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      phone: '11999222333',
      password: '123456',
      resume: 'https://linkedin.com/in/jane-doe',
    })

    const authResponse = await request(server.server).post('/sessions').send({
      email: 'janedoe@example.com',
      password: '123456',
    })

    const cookies = authResponse.get('Set-Cookie')

    const response = await request(server.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
