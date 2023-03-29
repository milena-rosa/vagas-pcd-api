import { app } from '@/app'
import { createAndAuthenticateCandidate } from '@/utils/test/create-and-authenticate-candidate'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('candidate profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get candidate profile', async () => {
    const { token } = await createAndAuthenticateCandidate(app)

    const profileResponse = await request(app.server)
      .get('/candidates')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(OK)
    expect(profileResponse.body).toEqual(
      expect.objectContaining({
        email: 'janedoe@example.com',
      }),
    )
  })
})
