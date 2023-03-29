import { FastifyInstance } from 'fastify'
import { authenticateCompany } from './authenticate'
import { companyProfile } from './profile'
import { registerCompany } from './register'

export async function companiesRoutes(app: FastifyInstance) {
  app.post('/companies', registerCompany)
  app.post('/companies/sessions', authenticateCompany)
  app.get('/companies/profile', companyProfile)
}
