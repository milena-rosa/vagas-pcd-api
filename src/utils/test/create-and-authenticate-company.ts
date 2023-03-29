import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateCompany(app: FastifyInstance) {
  const registerResponse = await request(app.server).post('/companies').send({
    cnpj: '23.243.199/0001-84',
    email: 'lojasponei@example.com',
    password: '123456',
  })

  const { id } = registerResponse.body

  const authResponse = await request(app.server)
    .post('/companies/sessions')
    .send({
      email: 'janedoe@example.com',
      password: '123456',
    })

  const { token } = authResponse.body

  return {
    id,
    token,
  }
}