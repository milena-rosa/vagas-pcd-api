import { DisabilityType, Location } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { createAndAuthenticateCompany } from './create-and-authenticate-company'

export async function createCompanyAndJobs(app: FastifyInstance) {
  const { token, company_id } = await createAndAuthenticateCompany(app)

  const createJobResponse = await request(app.server)
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

  return {
    company_id,
    companyToken: token,
    job_id,
  }
}
