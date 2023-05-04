import { server } from '@/app'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('government user authenticate (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be able to authenticate a government user', async () => {
    await request(server.server).post('/government-users').send({
      email: 'inss@gov.br',
      password: '123456',
    })

    const response = await request(server.server)
      .post('/government-users/sessions')
      .send({
        email: 'inss@gov.br',
        password: '123456',
      })

    expect(response.statusCode).toStrictEqual(OK)
    expect(response.body).toStrictEqual({
      token: expect.any(String),
      user: expect.objectContaining({
        email: 'inss@gov.br',
      }),
    })
  })
})
