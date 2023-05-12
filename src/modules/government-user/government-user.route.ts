import { FastifyInstance } from 'fastify'
import { CREATED, OK } from 'http-status'
import {
  authenticateGovernmentUser,
  recoverGovernmentUser,
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

  server.get(
    '/recover',
    {
      schema: {
        querystring: $ref('recoverGovernmentUserSchema'),
        response: { [OK]: $ref('governmentUserReplySchema') },
        tags: ['candidate'],
      },
    },
    recoverGovernmentUser,
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
