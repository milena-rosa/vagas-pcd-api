import { FastifyInstance } from 'fastify'
import { companyProfile } from './profile'
import { registerCompany } from './register'

export async function companiesRoutes(app: FastifyInstance) {
  app.post('/companies', registerCompany)
  app.get('/companies/profile', companyProfile)
}
