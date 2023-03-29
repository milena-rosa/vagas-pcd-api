import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { authenticateCandidate } from './authenticate'
import { candidateProfile } from './profile'
import { registerCandidate } from './register'

export async function candidatesRoutes(app: FastifyInstance) {
  app.post('/candidates', registerCandidate)
  app.post('/candidates/sessions', authenticateCandidate)

  app.get('/candidates', { onRequest: [verifyJWT] }, candidateProfile)
}
