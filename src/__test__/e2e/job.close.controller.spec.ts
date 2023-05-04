import { server } from '@/app'
import { createAndAuthenticateCompany } from '@/utils/test/create-and-authenticate-company'
import { DisabilityType, Location } from '@prisma/client'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('close job (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be able to close a job', async () => {
    const { token } = await createAndAuthenticateCompany(server)

    const createJobResponse = await request(server.server)
      .post('/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Engenheiro(a) de software',
        description: 'Vaga massinha com uma descrição legal.',
        role: 'Analista',
        salary: 10000,
        linkedin: 'https://www.linkedin.com/jobs/view/3580802802',
        perks:
          '- Vale alimentação: R$ 500,00;\n - Vale refeição: R$ 1000,00;\n- Plano de saúde;\n-Gympass.',
        disability_type: DisabilityType.ANY,
        location: Location.ON_SITE,
      })

    const { job_id } = createJobResponse.body

    const response = await request(server.server)
      .patch(`/jobs/${job_id}/close`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(OK)
    expect(response.body.closed_at).not.toBeNull()
  })
})
