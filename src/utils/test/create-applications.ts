import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { createCompanyAndJobs } from './create-company-and-jobs'

export async function createApplications(app: FastifyInstance) {
  const { job_id, company_id, companyToken } = await createCompanyAndJobs(app)

  await request(app.server).post('/candidate').send({
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

  const {
    body: { token: candidateToken1 },
  } = await request(app.server).post('/candidate/sessions').send({
    email: 'janedoe@example.com',
    password: '123456',
  })

  await request(app.server)
    .post(`/applications/${job_id}`)
    .set('Authorization', `Bearer ${candidateToken1}`)
    .send()

  await request(app.server).post('/candidate').send({
    name: 'Jane Doe',
    email: 'janedoe2@example.com',
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

  const {
    body: { token: candidateToken2 },
  } = await request(app.server).post('/candidate/sessions').send({
    email: 'janedoe2@example.com',
    password: '123456',
  })

  await request(app.server)
    .post(`/applications/${job_id}`)
    .set('Authorization', `Bearer ${candidateToken2}`)
    .send()

  await request(app.server).post('/candidate').send({
    name: 'Jane Doe',
    email: 'janedoe3@example.com',
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

  const {
    body: { token: candidateToken3 },
  } = await request(app.server).post('/candidate/sessions').send({
    email: 'janedoe3@example.com',
    password: '123456',
  })

  await request(app.server)
    .post(`/applications/${job_id}`)
    .set('Authorization', `Bearer ${candidateToken3}`)
    .send()

  return { job_id, company_id, companyToken }
}
