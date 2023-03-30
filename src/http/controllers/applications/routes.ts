import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { FastifyInstance } from 'fastify'
import { applyForJob } from './apply-for-job'
import { candidateApplicationsHistory } from './candidate-applications-history'
import { candidateOpenApplications } from './candidate-open-applications'

export async function applicationsRoutes(app: FastifyInstance) {
  app.post(
    '/jobs/:job_id/apply',
    { onRequest: [verifyJWT, verifyUserRole('CANDIDATE')] },
    applyForJob,
  )
  app.get(
    '/candidates/applications/history',
    { onRequest: [verifyJWT, verifyUserRole('CANDIDATE')] },
    candidateApplicationsHistory,
  )

  app.get(
    '/candidates/applications/open',
    { onRequest: [verifyJWT, verifyUserRole('CANDIDATE')] },
    candidateOpenApplications,
  )
}
