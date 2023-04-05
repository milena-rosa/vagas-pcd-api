import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { FastifyInstance } from 'fastify'
import { applyForJob } from './apply-for-job'
import { closeJob } from './close'
import { createJob } from './create'
import { jobCandidates } from './job-candidates'
import { searchJobs } from './search-jobs'

export async function jobsRoutes(app: FastifyInstance) {
  app.get('/search', searchJobs)

  app.post(
    '/',
    { onRequest: [verifyJWT, verifyUserRole('COMPANY')] },
    createJob,
  )

  app.patch(
    '/:job_id/close',
    { onRequest: [verifyJWT, verifyUserRole('COMPANY')] },
    closeJob,
  )

  app.get(
    '/:job_id/candidates',
    { onRequest: [verifyJWT, verifyUserRole('COMPANY')] },
    jobCandidates,
  )

  app.post(
    '/:job_id/apply',
    { onRequest: [verifyJWT, verifyUserRole('CANDIDATE')] },
    applyForJob,
  )
}
