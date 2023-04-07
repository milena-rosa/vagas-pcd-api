import { server } from '@/app'
import { DisabilityTypeDictionary } from '@/repositories/jobs-repository'
import { createAndAuthenticateCompany } from '@/utils/test/create-and-authenticate-company'
import { DisabilityType, Location } from '@prisma/client'
import { OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('search job (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be able to search for jobs', async () => {
    const { token: companyToken } = await createAndAuthenticateCompany(server)

    // create 2 jobs
    await request(server.server)
      .post('/jobs')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        title: 'Pessoa desenvolvedora de software',
        description: 'Vaga massinha com uma descrição legal.',
        role: 'Analista',
        salary: 10000,
        disability_type: DisabilityType.HEARING,
        location: Location.ON_SITE,
      })

    await request(server.server)
      .post('/jobs')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        title: 'Designer de produto',
        description: 'Vaga massinha com uma descrição legal.',
        role: 'Estágio',
        salary: 1000,
        disability_type: DisabilityType.ANY,
        location: Location.ON_SITE,
      })

    let searchResponse = await request(server.server)
      .get('/jobs/search')
      .query({
        query: 'desenvolvedor',
        page: 1,
      })
      .send()

    expect(searchResponse.statusCode).toEqual(OK)
    expect(searchResponse.body).toHaveLength(1)
    expect(searchResponse.body).toEqual([
      expect.objectContaining({
        title: 'Pessoa desenvolvedora de software',
      }),
    ])

    searchResponse = await request(server.server)
      .get('/jobs/search')
      .query({
        query: 'audição',
        page: 1,
      })
      .send()

    expect(searchResponse.statusCode).toEqual(OK)
    expect(searchResponse.body).toEqual([
      expect.objectContaining({
        disability_type: DisabilityTypeDictionary[DisabilityType.HEARING],
      }),
    ])
  })
})
