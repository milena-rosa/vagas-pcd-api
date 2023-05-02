import { FastifyInstance } from 'fastify'
import { CREATED, OK } from 'http-status'
import {
  authenticateGovernmentUser,
  registerGovernmentUser,
} from './government-user.controller'
import { $ref } from './government-user.schema'

export async function governmentUserRoutes(server: FastifyInstance) {
  server.post(
    '/sessions',
    {
      schema: {
        body: $ref('authenticateGovernmentUserSchema'),
        response: { [OK]: $ref('authenticateGovernmentUserReplySchema') },
        tags: ['government-user'],
      },
    },
    authenticateGovernmentUser,
  )

  server.post(
    '/',
    {
      schema: {
        body: $ref('createGovernmentUserSchema'),
        response: { [CREATED]: $ref('createGovernmentUserReplySchema') },
        tags: ['government-user'],
      },
    },
    registerGovernmentUser,
  )
}
