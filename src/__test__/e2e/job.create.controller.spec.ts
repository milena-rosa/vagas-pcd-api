import { server } from '@/app'
import { createAndAuthenticateCompany } from '@/utils/test/create-and-authenticate-company'
import { DisabilityType, Location } from '@prisma/client'
import { CREATED } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe.only('create job (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be able to create a job', async () => {
    const { token, company_id } = await createAndAuthenticateCompany(server)

    const response = await request(server.server)
      .post('/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Engenheiro(a) de software',
        description: 'Vaga massinha com uma descrição legal.',
        role: 'Analista',
        salary: 10000,
        location: Location.ON_SITE,
        disability_type: DisabilityType.ANY,
      })

    expect(response.statusCode).toEqual(CREATED)
    expect(response.body.job_id).toEqual(expect.any(String))
    expect(response.body.company_id).toEqual(company_id)
  })
})
