import { app } from '@/app'
import { createAndAuthenticateCompany } from '@/utils/test/create-and-authenticate-company'
import { DisabilityType, Location } from '@prisma/client'
import { CREATED } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('create job (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a job', async () => {
    const { token, companyId } = await createAndAuthenticateCompany(app)

    const response = await request(app.server)
      .post('/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Engenheiro(a) de software',
        description: 'Vaga massinha com uma descrição legal.',
        role: 'Analista',
        salary: 10000,
        location: Location.ON_SITE,
        disabilityType: DisabilityType.ANY,
      })

    expect(response.statusCode).toEqual(CREATED)
    expect(response.body.id).toEqual(expect.any(String))
    expect(response.body.company_id).toEqual(companyId)
  })
})