import { FastifyInstance } from 'fastify'
import { CREATED, OK } from 'http-status'
import { companyProfile, registerCompany } from './company.controller'
import { $ref } from './company.schema'

export async function companyRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        body: $ref('createCompanySchema'),
        response: { [CREATED]: $ref('createCompanyReplySchema') },
        tags: ['company'],
      },
    },
    registerCompany,
  )

  server.get(
    '/:company_id',
    {
      schema: {
        params: $ref('companyProfileSchema'),
        response: { [OK]: $ref('companyReplySchema') },
        tags: ['company'],
      },
    },
    companyProfile,
  )
}
