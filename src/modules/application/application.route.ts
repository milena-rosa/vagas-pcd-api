import { verifyUserRole } from '@/middlewares/verify-user-role'
import { FastifyInstance } from 'fastify'
import { CREATED, OK } from 'http-status'
import {
  createApplication,
  listAllCandidateApplications,
  listJobApplications,
} from './application.controller'
import { $ref } from './application.schema'

export async function applicationRoutes(server: FastifyInstance) {
  server.post(
    '/:job_id',
    {
      preHandler: [server.authenticate, verifyUserRole('CANDIDATE')],
      schema: {
        params: $ref('createApplicationSchema'),
        response: { [CREATED]: $ref('createApplicationSchema') },
        tags: ['application'],
      },
    },
    createApplication,
  )

  server.get(
    '/:job_id',
    {
      preHandler: [server.authenticate, verifyUserRole('COMPANY')],
      schema: {
        params: $ref('listJobApplicationsParamsSchema'),
        querystring: $ref('listJobApplicationsQuerystringSchema'),
        response: { [OK]: $ref('listJobApplicationsReplySchema') },
      },
    },
    listJobApplications,
  )

  server.get(
    '/history',
    {
      preHandler: [server.authenticate, verifyUserRole('CANDIDATE')],
      schema: {
        querystring: $ref('listCandidateApplicationsQuerystringSchema'),
        response: { [OK]: $ref('listCandidateApplicationsReplySchema') },
      },
    },
    listAllCandidateApplications,
  )

  server.get(
    '/open',
    {
      preHandler: [server.authenticate, verifyUserRole('CANDIDATE')],
      schema: {
        querystring: $ref('listCandidateApplicationsQuerystringSchema'),
        response: { [OK]: $ref('listCandidateApplicationsReplySchema') },
      },
    },
    listAllCandidateApplications,
  )
}
