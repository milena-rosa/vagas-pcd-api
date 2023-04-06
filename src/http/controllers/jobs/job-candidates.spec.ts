import { server } from '@/app'
import { createApplications } from '@/utils/test/create-applications'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('job candidates (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be able to list all candidates that applied for a job', async () => {
    const { companyToken, jobId } = await createApplications(server)

    const response = await request(server.server)
      .get(`/jobs/${jobId}/candidates`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send()

    expect(response.statusCode).toEqual(OK)
    expect(response.body.candidates).toHaveLength(3)
  })
})
