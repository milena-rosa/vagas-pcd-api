import { FastifyInstance } from 'fastify'

export async function healthRoutes(app: FastifyInstance) {
  app.get(
    '/health',
    {
      schema: {
        description: 'This is an endpoint for application health check',
        tags: ['health'],
        response: {
          200: {
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
