import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { refreshToken } from './refresh-token'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refreshToken)
}
