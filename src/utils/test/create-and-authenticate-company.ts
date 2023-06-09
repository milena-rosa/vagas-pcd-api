import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateCompany(app: FastifyInstance) {
  const registerResponse = await request(app.server).post('/company').send({
    cnpj: '23.243.199/0001-84',
    email: 'lojasponei@example.com',
    linkedin: 'https://www.linkedin.com/company/lojasponei/',
    about: 'Lojas Ponei é uma empresa massinha.',
    password: '123456',
  })

  const { company_id } = registerResponse.body

  const authResponse = await request(app.server)
    .post('/company/sessions')
    .send({
      email: 'lojasponei@example.com',
      password: '123456',
    })

  const { token } = authResponse.body

  return {
    company_id,
    token,
  }
}
