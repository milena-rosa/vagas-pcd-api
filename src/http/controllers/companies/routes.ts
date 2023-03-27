import { FastifyInstance } from 'fastify'
import { companyProfile } from './company-profile'

export async function companiesRoutes(app: FastifyInstance) {
  app.get('/companies/profile/:cnpj', companyProfile)
}
