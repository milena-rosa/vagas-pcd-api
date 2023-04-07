import { verifyUserRole } from '@/middlewares/verify-user-role'
import { FastifyInstance } from 'fastify'
import { CREATED, OK } from 'http-status'
import {
  closeJob,
  companyJobsHistory,
  companyOpenJobs,
  createJob,
  searchJobs,
} from './job.controller'
import { $ref } from './job.schema'

export async function jobRoutes(server: FastifyInstance) {
  server.get(
    '/search',
    {
      schema: {
        querystring: $ref('searchJobSchema'),
        response: { [OK]: $ref('searchJobReplySchema') },
        tags: ['job'],
      },
    },
    searchJobs,
  )

  server.post(
    '/',
    {
      preHandler: [server.authenticate, verifyUserRole('COMPANY')],
      schema: {
        body: $ref('createJobBodySchema'),
        response: { [CREATED]: $ref('createJobReplySchema') },
        tags: ['job'],
      },
    },
    createJob,
  )

  server.patch(
    '/:job_id/close',
    {
      preHandler: [server.authenticate, verifyUserRole('COMPANY')],
      schema: {
        params: $ref('closeJobSchema'),
        response: { [OK]: $ref('closeJobReplySchema') },
        tags: ['job'],
      },
    },
    closeJob,
  )

  server.get(
    '/history',
    {
      preHandler: [server.authenticate, verifyUserRole('COMPANY')],
      schema: {
        querystring: $ref('jobListSchema'),
        response: { [OK]: $ref('jobListReplySchema') },
        tags: ['job'],
      },
    },
    companyJobsHistory,
  )

  server.get(
    '/open',
    {
      preHandler: [server.authenticate, verifyUserRole('COMPANY')],
      schema: {
        querystring: $ref('jobListSchema'),
        response: { [OK]: $ref('jobListReplySchema') },
        tags: ['job'],
      },
    },
    companyOpenJobs,
  )
}
