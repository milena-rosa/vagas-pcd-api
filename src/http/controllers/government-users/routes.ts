import { FastifyInstance } from 'fastify'
import { registerGovernmentUser } from './register'

export async function governmentUsersRoutes(app: FastifyInstance) {
  app.post('/', registerGovernmentUser)
}
