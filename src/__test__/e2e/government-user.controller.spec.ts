import { server } from '@/app'
import { CREATED } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('government user controller (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be able to register a government user', async () => {
    const response = await request(server.server)
      .post('/government-users')
      .send({
        email: 'inss@gov.br',
        password: '123456',
      })

    expect(response.statusCode).toEqual(CREATED)
    expect(response.body).toEqual(
      expect.objectContaining({
        user_id: expect.any(String),
      }),
    )
  })
})
