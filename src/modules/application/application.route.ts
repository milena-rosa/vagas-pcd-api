import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { FastifyInstance } from 'fastify'
import { CREATED, OK } from 'http-status'
import { createApplication, listApplications } from './application.controller'
import { $ref } from './application.schema'

export async function applicationRoutes(server: FastifyInstance) {
  server.post(
    '/:job_id',
    {
      preHandler: [server.authenticate, verifyUserRole('CANDIDATE')],
      schema: {
        body: $ref('createApplicationSchema'),
        response: { [CREATED]: $ref('createApplicationSchema') },
        tags: ['application'],
      },
    },
    createApplication,
  )

  server.get(
    '/:job-id',
    {
      preHandler: [server.authenticate, verifyUserRole('COMPANY')],
      schema: {
        params: $ref('listApplicationsParamsSchema'),
        querystring: $ref('listApplicationsQuerystringSchema'),
        response: { [OK]: $ref('listApplicationsReplySchema') },
      },
    },
    listApplications,
  )

  // server.get(
  //   '/history',
  //   {
  //     preHandler: [server.authenticate, verifyUserRole('CANDIDATE')],
  //     schema: {
  //       params: $ref('listApplicationsParamsSchema'),
  //       querystring: $ref('listApplicationsQuerystringSchema'),
  //       response: { [OK]: $ref('listApplicationsReplySchema') },
  //     },
  //   },
  //   candidateApplicationsHistory,
  // )
}
