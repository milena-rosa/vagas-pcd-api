import { server } from '@/app'
import { createAndAuthenticateCandidate } from '@/utils/test/create-and-authenticate-candidate'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('candidate get profile (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be able to get the profile of logged candidate', async () => {
    const { candidate_id, token } = await createAndAuthenticateCandidate(server)

    const profileResponse = await request(server.server)
      .get('/candidates/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(OK)
    expect(profileResponse.body.candidate_id).toEqual(candidate_id)
  })
})
