import { FastifyInstance } from 'fastify'
import { searchJobs } from './search-jobs'

export async function jobsRoutes(app: FastifyInstance) {
  app.get('/jobs', searchJobs)
}
