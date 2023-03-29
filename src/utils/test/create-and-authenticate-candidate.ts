import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateCandidate(app: FastifyInstance) {
  const registerResponse = await request(app.server).post('/candidates').send({
    name: 'Jane Doe',
    email: 'janedoe@example.com',
    phone: '11999222333',
    password: '123456',
    resume: 'https://linkedin.com/in/jane-doe',
  })

  const { id } = registerResponse.body

  const authResponse = await request(app.server)
    .post('/candidates/sessions')
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
