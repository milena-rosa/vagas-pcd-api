import { app } from '@/app'
import { createAndAuthenticateCandidate } from '@/utils/test/create-and-authenticate-candidate'
import { createCompanyAndJobs } from '@/utils/test/create-company-and-jobs'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('candidate applications history (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch the applications history of the logged candidate', async () => {
    const { jobId } = await createCompanyAndJobs(app)
    const { token: candidateToken } = await createAndAuthenticateCandidate(app)

    await request(app.server)
      .post(`/jobs/${jobId}/apply`)
      .set('Authorization', `Bearer ${candidateToken}`)
      .send()

    const candidateApplicationsHistoryResponse = await request(app.server)
      .get('/candidates/applications/history')
      .set('Authorization', `Bearer ${candidateToken}`)
      .query({
        page: 1,
      })
      .send()

    expect(candidateApplicationsHistoryResponse.statusCode).toEqual(OK)
    expect(candidateApplicationsHistoryResponse.body.jobs).toHaveLength(1)
  })
})
