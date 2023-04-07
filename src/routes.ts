import { FastifyInstance } from 'fastify'
import { applicationRoutes } from './modules/application/application.route'
import { candidateRoutes } from './modules/candidate/candidate.route'
import { companyRoutes } from './modules/company/company.route'
import { governmentUserRoutes } from './modules/government-user/government-user.route'
import { healthRoutes } from './modules/health/health.route'
import { jobRoutes } from './modules/job/job.route'
import { userRoutes } from './modules/user/user.route'

export async function appRoutes(server: FastifyInstance) {
  server.register(userRoutes)
  server.register(candidateRoutes, { prefix: 'candidates' })
  server.register(companyRoutes, { prefix: 'companies' })
  server.register(governmentUserRoutes, { prefix: 'government-users' })
  server.register(jobRoutes, { prefix: 'jobs' })
  server.register(applicationRoutes, { prefix: 'applications' })
  server.register(healthRoutes, { prefix: 'health' })
}
