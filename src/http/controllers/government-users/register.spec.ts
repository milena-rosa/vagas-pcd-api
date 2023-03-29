import { app } from '@/app'
import { CREATED } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('register government user (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register a government user', async () => {
    const response = await request(app.server).post('/government-users').send({
      email: 'inss@gov.br',
      password: '123456',
    })

    expect(response.statusCode).toEqual(CREATED)
  })
})
