import { DisabilityType, Location } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { createAndAuthenticateCompany } from './create-and-authenticate-company'

export async function createCompanyAndJobs(app: FastifyInstance) {
  const { token, companyId } = await createAndAuthenticateCompany(app)

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

  const { id } = createJobResponse.body

  return {
    companyId,
    companyToken: token,
    jobId: id,
  }
}
