import { app } from '@/app'
import { createAndAuthenticateCompany } from '@/utils/test/create-and-authenticate-company'
import { DisabilityType, Location } from '@prisma/client'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('close job (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to close a job', async () => {
    const { token } = await createAndAuthenticateCompany(app)

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

    const { id: jobId } = createJobResponse.body

    const response = await request(app.server)
      .patch(`/jobs/${jobId}/close`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(OK)
    expect(response.body.closed_at).not.toBeNull()
  })
})
