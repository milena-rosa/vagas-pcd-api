import { FastifyInstance } from 'fastify'
import { candidatesRoutes } from './candidates/routes'
import { companiesRoutes } from './companies/routes'
import { governmentUsersRoutes } from './government-users/routes'
import { healthRoutes } from './health/routes'
import { jobsRoutes } from './jobs/routes'

export async function appRoutes(app: FastifyInstance) {
  app.register(candidatesRoutes, { prefix: 'candidates' })
  app.register(companiesRoutes, { prefix: 'companies' })
  app.register(governmentUsersRoutes, { prefix: 'government-users' })
  app.register(jobsRoutes, { prefix: 'jobs' })
  app.register(healthRoutes)
}
