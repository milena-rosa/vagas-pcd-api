import { FastifyInstance } from 'fastify'
import { OK } from 'http-status'

export async function healthRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      schema: {
        description: 'This is an endpoint for application health check',
        tags: ['health'],
        response: {
          [OK]: {
            description: 'Success Response',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    (_, reply) => {
      reply.send({ message: 'The application is up and running' })
    },
  )
}
