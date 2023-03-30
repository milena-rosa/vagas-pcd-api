import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { FastifyInstance } from 'fastify'
import { closeJob } from './close'
import { companyJobsHistory } from './company-job-history'
import { companyOpenJobs } from './company-open-jobs'
import { createJob } from './create'
import { searchJobs } from './search-jobs'

export async function jobsRoutes(app: FastifyInstance) {
  app.get('/jobs/search', searchJobs)

  app.post(
    '/jobs',
    { onRequest: [verifyJWT, verifyUserRole('COMPANY')] },
    createJob,
  )

  app.patch(
    '/jobs/close/:job_id',
    { onRequest: [verifyJWT, verifyUserRole('COMPANY')] },
    closeJob,
  )

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
