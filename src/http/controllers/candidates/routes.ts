import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { FastifyInstance } from 'fastify'
import { candidateApplicationsHistory } from './candidate-applications-history'
import { candidateOpenApplications } from './candidate-open-applications'

export async function candidatesRoutes(app: FastifyInstance) {
  app.get(
    '/applications/history',
    { onRequest: [verifyJWT, verifyUserRole('CANDIDATE')] },
    candidateApplicationsHistory,
  )

  app.get(
    '/applications/open',
    { onRequest: [verifyJWT, verifyUserRole('CANDIDATE')] },
    candidateOpenApplications,
  )
}
