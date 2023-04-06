import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { FastifyInstance } from 'fastify'
import { CREATED, OK } from 'http-status'
import {
  candidateProfile,
  registerCandidate,
  updateCandidate,
} from './candidate.controller'
import { $ref } from './candidate.schema'

export async function candidateRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        body: $ref('createCandidateSchema'),
        response: { [CREATED]: $ref('createCandidateReplySchema') },
        tags: ['candidate'],
      },
    },
    registerCandidate,
  )

  server.get(
    '/me',
    {
      preHandler: [server.authenticate, verifyUserRole('CANDIDATE')],
      schema: {
        response: { [OK]: $ref('candidateReplySchema') },
        tags: ['candidate'],
      },
    },
    candidateProfile,
  )

  server.patch(
    '/',
    {
      preHandler: [server.authenticate, verifyUserRole('CANDIDATE')],
      schema: {
        body: $ref('updateCandidateSchema'),
        response: { [CREATED]: $ref('updateCandidateReplySchema') },
        tags: ['candidate'],
      },
    },
    updateCandidate,
  )
}
