import { server } from '@/app'
import { DisabilityTypeDictionary } from '@/repositories/jobs-repository'
import { createAndAuthenticateCompany } from '@/utils/test/create-and-authenticate-company'
import { DisabilityType, Location } from '@prisma/client'
import { CREATED, OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('job controller (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be able to create a job', async () => {
    const { token, companyId } = await createAndAuthenticateCompany(server)

    const response = await request(server.server)
      .post('/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Engenheiro(a) de software',
        description: 'Vaga massinha com uma descrição legal.',
        role: 'Analista',
        salary: 10000,
        location: Location.ON_SITE,
        disabilityType: DisabilityType.ANY,
      })

    expect(response.statusCode).toEqual(CREATED)
    expect(response.body.id).toEqual(expect.any(String))
    expect(response.body.company_id).toEqual(companyId)
  })

  it('should be able to close a job', async () => {
    const { token } = await createAndAuthenticateCompany(server)

    const createJobResponse = await request(server.server)
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

    const { id: jobId } = createJobResponse.body

    const response = await request(server.server)
      .patch(`/jobs/${jobId}/close`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(OK)
    expect(response.body.closed_at).not.toBeNull()
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
        disabilityType: DisabilityType.HEARING,
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
        disabilityType: DisabilityType.ANY,
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

  it('should be able to fetch the jobs history of the logged company', async () => {
    const { token } = await createAndAuthenticateCompany(server)

    await request(server.server)
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

    await request(server.server)
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

    const companyJobsHistoryResponse = await request(server.server)
      .get('/jobs/history')
      .set('Authorization', `Bearer ${token}`)
      .query({
        page: 1,
      })
      .send()

    expect(companyJobsHistoryResponse.statusCode).toEqual(OK)
    expect(companyJobsHistoryResponse.body).toHaveLength(2)
  })

  it('should be able to fetch the open jobs of the logged company', async () => {
    const { token } = await createAndAuthenticateCompany(server)

    // create 2 jobs
    await request(server.server)
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

    const createJobResponse = await request(server.server)
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

    // close 1 job
    const { id: jobId } = createJobResponse.body
    await request(server.server)
      .patch(`/jobs/${jobId}/close`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    const companyOpenJobsResponse = await request(server.server)
      .get('/companies/jobs/open')
      .set('Authorization', `Bearer ${token}`)
      .query({
        page: 1,
      })
      .send()

    expect(companyOpenJobsResponse.statusCode).toEqual(OK)
    expect(companyOpenJobsResponse.body).toHaveLength(1)
  })
})
