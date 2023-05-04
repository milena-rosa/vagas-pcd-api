import { FastifyInstance } from 'fastify'
import { CREATED, OK } from 'http-status'
import {
  authenticateCompany,
  companyProfile,
  recoverCompany,
  registerCompany,
} from './company.controller'
import { $ref } from './company.schema'

export async function companyRoutes(server: FastifyInstance) {
  server.post(
    '/sessions',
    {
      schema: {
        body: $ref('authenticateCompanySchema'),
        response: { [OK]: $ref('authenticateCompanyReplySchema') },
        tags: ['company'],
      },
    },
    authenticateCompany,
  )

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

  server.get(
    '/recover',
    {
      schema: {
        querystring: $ref('recoverCompanySchema'),
        response: { [OK]: $ref('companyReplySchema') },
        tags: ['company'],
      },
    },
    recoverCompany,
  )
}
