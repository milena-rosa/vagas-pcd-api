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

  it('should be able to get the profile of logged candidate', async () => {
    const { candidateId, token } = await createAndAuthenticateCandidate(app)

    const profileResponse = await request(app.server)
      .get('/candidates/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(OK)
    expect(profileResponse.body.candidate_id).toEqual(candidateId)
  })
})
