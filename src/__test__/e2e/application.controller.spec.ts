import { server } from '@/app'
import { createAndAuthenticateCandidate } from '@/utils/test/create-and-authenticate-candidate'
import { createCompanyAndJobs } from '@/utils/test/create-company-and-jobs'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('list candidate applications (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be able to fetch the applications history of the logged candidate', async () => {
    const { job_id } = await createCompanyAndJobs(server)
    const { token: candidateToken } = await createAndAuthenticateCandidate(
      server,
    )

    await request(server.server)
      .post(`/applications/${job_id}`)
      .set('Authorization', `Bearer ${candidateToken}`)
      .send()

    const candidateApplicationsHistoryResponse = await request(server.server)
      .get('/applications/history')
      .set('Authorization', `Bearer ${candidateToken}`)
      .query({
        page: 1,
      })
      .send()

    expect(candidateApplicationsHistoryResponse.statusCode).toEqual(OK)
    expect(candidateApplicationsHistoryResponse.body.jobs).toHaveLength(1)
  })
})
