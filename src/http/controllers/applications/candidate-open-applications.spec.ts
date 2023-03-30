import { app } from '@/app'
import { createAndAuthenticateCandidate } from '@/utils/test/create-and-authenticate-candidate'
import { createCompanyAndJobs } from '@/utils/test/create-company-and-jobs'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('candidate open applications (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch the open applications of the logged candidate', async () => {
    const { jobId } = await createCompanyAndJobs(app)
    const { token: candidateToken } = await createAndAuthenticateCandidate(app)

    await request(app.server)
      .post(`/jobs/${jobId}/apply`)
      .set('Authorization', `Bearer ${candidateToken}`)
      .send()

    const candidateOpenApplicationsResponse = await request(app.server)
      .get('/candidates/jobs/open')
      .set('Authorization', `Bearer ${candidateToken}`)
      .query({
        page: 1,
      })
      .send()

    expect(candidateOpenApplicationsResponse.statusCode).toEqual(OK)
    expect(candidateOpenApplicationsResponse.body.jobs).toHaveLength(1)
  })
})
