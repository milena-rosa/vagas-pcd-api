import { server } from '@/app'
import { createAndAuthenticateCandidate } from '@/utils/test/create-and-authenticate-candidate'
import { createCompanyAndJobs } from '@/utils/test/create-company-and-jobs'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('candidate open applications (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be able to fetch the open applications of the logged candidate', async () => {
    const { jobId } = await createCompanyAndJobs(server)
    const { token: candidateToken } = await createAndAuthenticateCandidate(
      server,
    )

    await request(server.server)
      .post(`/jobs/${jobId}/apply`)
      .set('Authorization', `Bearer ${candidateToken}`)
      .send()

    const candidateOpenApplicationsResponse = await request(server.server)
      .get('/candidates/applications/open')
      .set('Authorization', `Bearer ${candidateToken}`)
      .query({
        page: 1,
      })
      .send()

    expect(candidateOpenApplicationsResponse.statusCode).toEqual(OK)
    expect(candidateOpenApplicationsResponse.body.jobs).toHaveLength(1)
  })
})
