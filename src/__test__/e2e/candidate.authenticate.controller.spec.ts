import { server } from '@/app'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('candidate authenticate (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be able to authenticate a candidate', async () => {
    await request(server.server).post('/candidate').send({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      phone: '11999222333',
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
      password: '123456',
    })

    const response = await request(server.server)
      .post('/candidate/sessions')
      .send({
        email: 'janedoe@example.com',
        password: '123456',
      })

    expect(response.statusCode).toStrictEqual(OK)
    expect(response.body).toStrictEqual({
      token: expect.any(String),
      user: expect.objectContaining({
        candidate_id: expect.any(String),
        name: 'Jane Doe',
        email: 'janedoe@example.com',
      }),
    })
  })
})
