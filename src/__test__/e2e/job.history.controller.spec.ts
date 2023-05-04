import { server } from '@/app'
import { createAndAuthenticateCompany } from '@/utils/test/create-and-authenticate-company'
import { DisabilityType, Location } from '@prisma/client'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('company job history (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be able to fetch the jobs history of the logged company', async () => {
    const { token } = await createAndAuthenticateCompany(server)

    await request(server.server)
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

    await request(server.server)
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

    const companyJobsHistoryResponse = await request(server.server)
      .get('/jobs/history')
      .set('Authorization', `Bearer ${token}`)
      .query({
        page: 1,
      })
      .send()

    expect(companyJobsHistoryResponse.statusCode).toEqual(OK)
    expect(companyJobsHistoryResponse.body).toHaveLength(2)
  })
})
