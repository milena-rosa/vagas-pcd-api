import { FastifyInstance } from 'fastify'
import { CREATED } from 'http-status'
import { registerGovernmentUser } from './government-user.controller'
import { $ref } from './government-user.schema'

export async function governmentUserRoutes(server: FastifyInstance) {
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
