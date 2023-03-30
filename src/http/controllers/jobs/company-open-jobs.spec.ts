import { app } from '@/app'
import { createAndAuthenticateCompany } from '@/utils/test/create-and-authenticate-company'
import { DisabilityType, Location } from '@prisma/client'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('company open jobs (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch the open jobs of the logged company', async () => {
    const { token } = await createAndAuthenticateCompany(app)

    // create 2 jobs
    await request(app.server)
      .post('/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Engenheiro(a) de software',
        description: 'Vaga massinha com uma descrição legal.',
        role: 'Analista',
        salary: 10000,
        disabilityType: DisabilityType.ANY,
        location: Location.ON_SITE,
      })

    const createJobResponse = await request(app.server)
      .post('/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Engenheiro(a) de software',
        description: 'Vaga massinha com uma descrição legal.',
        role: 'Analista',
        salary: 10000,
        disabilityType: DisabilityType.ANY,
        location: Location.ON_SITE,
      })

    // close 1 job
    const { id: jobId } = createJobResponse.body
    await request(app.server)
      .patch(`/jobs/close/${jobId}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    const companyOpenJobsResponse = await request(app.server)
      .get('/jobs/open')
      .set('Authorization', `Bearer ${token}`)
      .query({
        page: 1,
      })
      .send()

    expect(companyOpenJobsResponse.statusCode).toEqual(OK)
    expect(companyOpenJobsResponse.body).toHaveLength(1)
  })
})
