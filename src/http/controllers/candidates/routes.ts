import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { FastifyInstance } from 'fastify'
import { candidateApplicationsHistory } from './candidate-applications-history'
import { candidateOpenApplications } from './candidate-open-applications'
import { candidateProfile } from './profile'
import { registerCandidate } from './register'
import { updateCandidate } from './update'

export async function candidatesRoutes(app: FastifyInstance) {
  app.post('/', registerCandidate)

  app.get(
    '/me',
    { onRequest: [verifyJWT, verifyUserRole('CANDIDATE')] },
    candidateProfile,
  )

  app.patch(
    '/:candidate_id',
    { onRequest: [verifyJWT, verifyUserRole('CANDIDATE')] },
    updateCandidate,
  )

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
