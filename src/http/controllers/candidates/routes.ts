import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { FastifyInstance } from 'fastify'
import { candidateProfile } from './profile'
import { registerCandidate } from './register'
import { updateCandidate } from './update'

export async function candidatesRoutes(app: FastifyInstance) {
  app.post('/candidates', registerCandidate)

  app.get(
    '/candidates',
    { onRequest: [verifyJWT, verifyUserRole('CANDIDATE')] },
    candidateProfile,
  )
  app.patch(
    '/candidates/:user_id',
    { onRequest: [verifyJWT, verifyUserRole('CANDIDATE')] },
    updateCandidate,
  )
}
