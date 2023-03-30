import { makeFetchCompanyJobsHistoryUseCase } from '@/use-cases/jobs/factories/make-fetch-company-jobs-history-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { OK } from 'http-status'
import { z } from 'zod'

export async function companyJobsHistory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const companyJobsHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = companyJobsHistoryQuerySchema.parse(request.query)

  const fetchCompanyJobsHistoryUseCase = makeFetchCompanyJobsHistoryUseCase()
  const { jobs } = await fetchCompanyJobsHistoryUseCase.execute({
    companyId: request.user.sub,
    page,
  })

  return reply.status(OK).send(jobs)
}
