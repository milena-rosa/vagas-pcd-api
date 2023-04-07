import { FastifyInstance } from 'fastify'
import { healthRoutes } from './health/routes'

export async function appRoutes(app: FastifyInstance) {
  // app.register(candidatesRoutes, { prefix: 'candidates' })
  // app.register(companiesRoutes, { prefix: 'companies' })
  app.register(healthRoutes)
}
