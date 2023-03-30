import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { FastifyInstance } from 'fastify'
import { applyForJob } from './apply-for-job'
import { candidateApplicationsHistory } from './candidate-applications-history'
import { candidateOpenApplications } from './candidate-open-applications'
import { jobCandidates } from './job-candidates'

export async function applicationsRoutes(app: FastifyInstance) {
  app.post(
    '/jobs/:job_id/apply',
    { onRequest: [verifyJWT, verifyUserRole('CANDIDATE')] },
    applyForJob,
  )
  app.get(
    '/candidates/jobs/history',
    { onRequest: [verifyJWT, verifyUserRole('CANDIDATE')] },
    candidateApplicationsHistory,
  )

  app.get(
    '/candidates/jobs/open',
    { onRequest: [verifyJWT, verifyUserRole('CANDIDATE')] },
    candidateOpenApplications,
  )

  app.get(
    '/companies/jobs/:job_id/candidates',
    { onRequest: [verifyJWT, verifyUserRole('COMPANY')] },
    jobCandidates,
  )
}
