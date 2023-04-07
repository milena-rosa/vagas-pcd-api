import { server } from '@/app'
import { createAndAuthenticateCandidate } from '@/utils/test/create-and-authenticate-candidate'
import { CREATED, OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('candidate controller (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be able to get the profile of logged candidate', async () => {
    const { candidateId, token } = await createAndAuthenticateCandidate(server)

    const profileResponse = await request(server.server)
      .get('/candidates/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(OK)
    expect(profileResponse.body.candidate_id).toEqual(candidateId)
  })

  it('should be able to register a candidate', async () => {
    const response = await request(server.server).post('/candidates').send({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      phone: '11999222333',
      password: '123456',
      resume: 'https://linkedin.com/in/jane-doe',
    })

    expect(response.statusCode).toEqual(CREATED)
    expect(response.body).toEqual(
      expect.objectContaining({
        candidate_id: expect.any(String),
      }),
    )
  })

  it('should be able to update candidate info', async () => {
    const { candidateId, token } = await createAndAuthenticateCandidate(server)

    const newData = {
      password: '654321',
      oldPassword: '123456',
      name: 'John Doe',
      email: 'johndoe@example.com',
      resume: 'https://linkedin.com/in/john-doe',
      phone: '11999888777',
    }

    const response = await request(server.server)
      .patch(`/candidates/${candidateId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newData)

    expect(response.statusCode).toEqual(OK)
    expect(response.body).toEqual(
      expect.objectContaining({
        name: newData.name,
      }),
    )
  })

  it('should be able to refresh a token', async () => {
    await request(server.server).post('/candidates').send({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      phone: '11999222333',
      password: '123456',
      resume: 'https://linkedin.com/in/jane-doe',
    })

    const authResponse = await request(server.server).post('/sessions').send({
      email: 'janedoe@example.com',
      password: '123456',
    })

    const cookies = authResponse.get('Set-Cookie')

    const response = await request(server.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
