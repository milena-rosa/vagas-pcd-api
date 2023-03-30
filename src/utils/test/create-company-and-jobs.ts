import { DisabilityType, Location } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createCompanyAndJobs(app: FastifyInstance) {
  await request(app.server).post('/companies').send({
    cnpj: '23.243.199/0001-84',
    email: 'lojasponei@example.com',
    password: '123456',
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'lojasponei@example.com',
    password: '123456',
  })

  const { token } = authResponse.body

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
    jobId: id,
  }
}
