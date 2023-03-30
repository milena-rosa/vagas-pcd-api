import { FastifyInstance } from 'fastify'
import { applicationsRoutes } from './applications/routes'
import { candidatesRoutes } from './candidates/routes'
import { companiesRoutes } from './companies/routes'
import { governmentUsersRoutes } from './government-users/routes'
import { jobsRoutes } from './jobs/routes'
import { usersRoutes } from './users/routes'

export async function appRoutes(app: FastifyInstance) {
  app.register(candidatesRoutes)
  app.register(companiesRoutes)
  app.register(governmentUsersRoutes)
  app.register(jobsRoutes)
  app.register(usersRoutes)
  app.register(applicationsRoutes)
}
