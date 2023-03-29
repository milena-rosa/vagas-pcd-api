import { app } from '@/app'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('authenticate candidate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate a candidate', async () => {
    await request(app.server).post('/candidates').send({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      phone: '11999222333',
      password: '123456',
      resume: 'https://linkedin.com/in/jane-doe',
    })

    const response = await request(app.server)
      .post('/candidates/sessions')
      .send({
        email: 'janedoe@example.com',
        password: '123456',
      })

    expect(response.statusCode).toEqual(OK)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
