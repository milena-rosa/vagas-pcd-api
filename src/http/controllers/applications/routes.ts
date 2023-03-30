import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { FastifyInstance } from 'fastify'
import { applyForJob } from './apply-for-job'
import { candidateApplicationsHistory } from './candidate-applications-history'

export async function applicationsRoutes(app: FastifyInstance) {
  app.post(
    '/jobs/:jobId/apply',
    { onRequest: [verifyJWT, verifyUserRole('CANDIDATE')] },
    applyForJob,
  )
  app.post(
    '/candidates/jobs/history',
    { onRequest: [verifyJWT, verifyUserRole('CANDIDATE')] },
    candidateApplicationsHistory,
  )
  // app.post(
  //   '/jobs',
  //   { onRequest: [verifyJWT, verifyUserRole('COMPANY')] },
  //   createJob,
  // )
  // app.patch(
  //   '/jobs/close/:jobId',
  //   { onRequest: [verifyJWT, verifyUserRole('COMPANY')] },
  //   closeJob,
  // )
  // app.get(
  //   '/jobs/history',
  //   { onRequest: [verifyJWT, verifyUserRole('COMPANY')] },
  //   companyJobsHistory,
  // )
  // app.get(
  //   '/jobs/open',
  //   { onRequest: [verifyJWT, verifyUserRole('COMPANY')] },
  //   companyOpenJobs,
  // )
  // app.get('/jobs/search', searchJobs)
}
