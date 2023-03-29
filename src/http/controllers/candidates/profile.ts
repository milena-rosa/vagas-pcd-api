import { makeGetCandidateProfileUseCase } from '@/use-cases/candidates/factories/make-get-candidate-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CREATED } from 'http-status'

export async function candidateProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getCandidateProfile = makeGetCandidateProfileUseCase()

  const { candidate } = await getCandidateProfile.execute({
    candidateId: request.user.sub,
  })

  return reply.status(CREATED).send({
    ...candidate,
    password_hash: undefined,
  })
}