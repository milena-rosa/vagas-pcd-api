import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateCandidate(app: FastifyInstance) {
  const registerResponse = await request(app.server).post('/candidate').send({
    name: 'Jane Doe',
    email: 'janedoe@example.com',
    phone: '11999222333',
    password: '123456',
    zipCode: '45007-605',
    street: 'Rua Padre Gilberto Vaz Sampaio',
    number: '933',
    complement: '',
    neighborhood: 'Lagoa das Flores',
    city: 'Vitória da Conquista',
    state: 'BA',
    linkedin: 'https://linkedin.com/in/jane-doe',
    professionalExperience: '',
    educationalBackground: '',
    skills: '',
  })

  const { candidate_id } = registerResponse.body

  const authResponse = await request(app.server)
    .post('/candidate/sessions')
    .send({
      email: 'janedoe@example.com',
      password: '123456',
    })

  const { token } = authResponse.body

  return {
    candidate_id,
    token,
  }
}
