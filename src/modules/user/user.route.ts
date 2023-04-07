import { FastifyInstance } from 'fastify'
import { OK } from 'http-status'
import { authenticate, refreshToken } from './user.controller'
import { $ref } from './user.schema'

export async function userRoutes(app: FastifyInstance) {
  app.post(
    '/sessions',
    {
      schema: {
        body: $ref('authenticateSchema'),
        response: { [OK]: $ref('authenticateReplySchema') },
        tags: ['sessions'],
      },
    },
    authenticate,
  )

  app.patch(
    '/token/refresh',
    {
      schema: {
        response: { [OK]: $ref('authenticateReplySchema') },
        tags: ['sessions'],
      },
    },
    refreshToken,
  )
}
