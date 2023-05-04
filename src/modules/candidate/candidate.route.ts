import { verifyUserRole } from '@/middlewares/verify-user-role'
import { FastifyInstance } from 'fastify'
import { CREATED, OK } from 'http-status'
import {
  authenticateCandidate,
  candidateProfile,
  recoverCandidate,
  registerCandidate,
  updateCandidate,
} from './candidate.controller'
import { $ref } from './candidate.schema'

export async function candidateRoutes(server: FastifyInstance) {
  server.post(
    '/sessions',
    {
      schema: {
        body: $ref('authenticateCandidateSchema'),
        response: { [OK]: $ref('authenticateCandidateReplySchema') },
        tags: ['candidate'],
      },
    },
    authenticateCandidate,
  )

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

  server.get(
    '/recover',
    {
      // preHandler: [server.authenticate, verifyUserRole('CANDIDATE')],
      schema: {
        querystring: $ref('recoverCandidateSchema'),
        response: { [OK]: $ref('candidateReplySchema') },
        tags: ['candidate'],
      },
    },
    recoverCandidate,
  )

  server.patch(
    '/',
    {
      preHandler: [server.authenticate, verifyUserRole('CANDIDATE')],
      schema: {
        body: $ref('updateCandidateBodySchema'),
        response: { [CREATED]: $ref('updateCandidateReplySchema') },
        tags: ['candidate'],
      },
    },
    updateCandidate,
  )
}
