import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { FastifyInstance } from 'fastify'
import { companyJobsHistory } from './company-job-history'
import { companyOpenJobs } from './company-open-jobs'
import { companyProfile } from './profile'
import { registerCompany } from './register'

export async function companiesRoutes(app: FastifyInstance) {
  app.post('/', registerCompany)
  app.get('/profile', companyProfile)

  app.get(
    '/jobs/history',
    { onRequest: [verifyJWT, verifyUserRole('COMPANY')] },
    companyJobsHistory,
  )

  app.get(
    '/jobs/open',
    { onRequest: [verifyJWT, verifyUserRole('COMPANY')] },
    companyOpenJobs,
  )
}
