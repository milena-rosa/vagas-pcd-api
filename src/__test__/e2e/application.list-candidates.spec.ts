import { server } from '@/app'
import { createApplications } from '@/utils/test/create-applications'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('candidates application list (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be able to list all candidates that applied for a job', async () => {
    const { companyToken, job_id } = await createApplications(server)

    const response = await request(server.server)
      .get(`/applications/${job_id}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send()

    expect(response.statusCode).toEqual(OK)
    expect(response.body.candidates).toHaveLength(3)
  })
})
