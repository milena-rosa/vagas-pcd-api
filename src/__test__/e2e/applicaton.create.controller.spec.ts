import { server } from '@/app'
import { createAndAuthenticateCandidate } from '@/utils/test/create-and-authenticate-candidate'
import { createAndAuthenticateCompany } from '@/utils/test/create-and-authenticate-company'
import { DisabilityType, Location } from '@prisma/client'
import { CREATED } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('create application (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be able to apply for a job', async () => {
    const { token: companyToken } = await createAndAuthenticateCompany(server)
    const { token: candidateToken } = await createAndAuthenticateCandidate(
      server,
    )

    // create job
    const jobResponse = await request(server.server)
      .post('/jobs')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        title: 'Engenheiro(a) de software',
        description: 'Vaga massinha com uma descrição legal.',
        role: 'Analista',
        salary: 10000,
        disability_type: DisabilityType.ANY,
        location: Location.ON_SITE,
      })

    const { job_id } = jobResponse.body

    const response = await request(server.server)
      .post(`/applications/${job_id}`)
      .set('Authorization', `Bearer ${candidateToken}`)
      .send()

    expect(response.statusCode).toEqual(CREATED)
  })
})
