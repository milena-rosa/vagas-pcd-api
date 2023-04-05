import { app } from '@/app'
import { createAndAuthenticateCompany } from '@/utils/test/create-and-authenticate-company'
import { DisabilityType, Location } from '@prisma/client'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('company job history (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch the jobs history of the logged company', async () => {
    const { token } = await createAndAuthenticateCompany(app)

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

    const companyJobsHistoryResponse = await request(app.server)
      .get('/companies/jobs/history')
      .set('Authorization', `Bearer ${token}`)
      .query({
        page: 1,
      })
      .send()

    expect(companyJobsHistoryResponse.statusCode).toEqual(OK)
    expect(companyJobsHistoryResponse.body).toHaveLength(2)
  })
})
