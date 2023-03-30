import { makeGetCandidateProfileUseCase } from '@/use-cases/candidates/factories/make-get-candidate-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { OK } from 'http-status'

export async function candidateProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getCandidateProfileUseCase = makeGetCandidateProfileUseCase()

  const { candidate } = await getCandidateProfileUseCase.execute({
    candidateId: request.user.sub,
  })

  return reply.status(OK).send({
    candidate_id: candidate.candidate_id,
    email: candidate.user.email,
    name: candidate.name,
    phone: candidate.phone,
    resume: candidate.resume,
    created_at: candidate.user.created_at,
  })
}
