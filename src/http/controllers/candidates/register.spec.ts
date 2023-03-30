import { app } from '@/app'
import { CREATED } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('register candidate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register a candidate', async () => {
    const response = await request(app.server).post('/candidates').send({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      phone: '11999222333',
      password: '123456',
      resume: 'https://linkedin.com/in/jane-doe',
    })

    expect(response.statusCode).toEqual(CREATED)
    expect(response.body).toEqual(
      expect.objectContaining({
        candidate_id: expect.any(String),
      }),
    )
  })
})
