import { makeGetCandidateProfileUseCase } from '@/use-cases/candidates/factories/make-get-candidate-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import httpStatus, { NOT_FOUND, OK } from 'http-status'

export async function candidateProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getCandidateProfileUseCase = makeGetCandidateProfileUseCase()

  if (!request.user.sub) {
    return reply.status(NOT_FOUND).send({ message: httpStatus['404_CLASS'] })
  }

  const { candidate } = await getCandidateProfileUseCase.execute({
    userId: request.user.sub,
  })

  return reply.status(OK).send({
    user_id: candidate.user_id,
    email: candidate.user.email,
    name: candidate.name,
    phone: candidate.phone,
    resume: candidate.resume,
    created_at: candidate.user.created_at,
  })
}
