import { server } from '@/app'
import { createAndAuthenticateCandidate } from '@/utils/test/create-and-authenticate-candidate'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('candidate update (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be able to update candidate info', async () => {
    const { token } = await createAndAuthenticateCandidate(server)

    const newData = {
      password: '654321',
      oldPassword: '123456',
      name: 'John Doe',
      email: 'johndoe@example.com',
      resume: 'https://linkedin.com/in/john-doe',
      phone: '11999888777',
    }

    const response = await request(server.server)
      .patch('/candidates')
      .set('Authorization', `Bearer ${token}`)
      .send(newData)

    expect(response.statusCode).toEqual(OK)
    expect(response.body).toEqual(
      expect.objectContaining({
        name: newData.name,
      }),
    )
  })
})
