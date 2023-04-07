import { server } from '@/app'
import { createAndAuthenticateCandidate } from '@/utils/test/create-and-authenticate-candidate'
import { createAndAuthenticateCompany } from '@/utils/test/create-and-authenticate-company'
import { createApplications } from '@/utils/test/create-applications'
import { DisabilityType, Location } from '@prisma/client'
import { CREATED, OK } from 'http-status'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('application controller (e2e)', () => {
  beforeAll(async () => {
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should be able to apply for a job', async () => {
    const { token: companyToken } = await createAndAuthenticateCompany(server)
    const { token: candidateToken } = await createAndAuthenticateCandidate(
      server,
    )

    // create job
    const jobResponse = await request(server.server)
      .post('/jobs')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        title: 'Engenheiro(a) de software',
        description: 'Vaga massinha com uma descrição legal.',
        role: 'Analista',
        salary: 10000,
        disability_type: DisabilityType.ANY,
        location: Location.ON_SITE,
      })

    const { id: jobId } = jobResponse.body

    const response = await request(server.server)
      .post(`/applications/${jobId}/apply`)
      .set('Authorization', `Bearer ${candidateToken}`)
      .send()

    expect(response.statusCode).toEqual(CREATED)
  })

  it('should be able to list all candidates that applied for a job', async () => {
    const { companyToken, jobId } = await createApplications(server)

    const response = await request(server.server)
      .get(`/applications/${jobId}`)
      .set('Authorization', `Bearer ${companyToken}`)
      .send()

    expect(response.statusCode).toEqual(OK)
    expect(response.body.candidates).toHaveLength(3)
  })
})
