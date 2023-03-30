import { makeFetchCandidateApplicationsHistoryUseCase } from '@/use-cases/applications/factories/make-fetch-candidate-applications-history-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CREATED } from 'http-status'
import { z } from 'zod'

export async function candidateApplicationsHistory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const candidateApplicationsHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = candidateApplicationsHistoryQuerySchema.parse(request.query)

  const fetchCandidateApplicationsHistoryUseCase =
    makeFetchCandidateApplicationsHistoryUseCase()

  await fetchCandidateApplicationsHistoryUseCase.execute({
    candidateId: request.user.sub,
    page,
  })

  return reply.status(CREATED).send()
}
