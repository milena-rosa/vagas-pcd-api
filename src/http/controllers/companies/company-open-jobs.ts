import { makeFetchCompanyOpenJobsUseCase } from '@/use-cases/jobs/factories/make-fetch-company-open-jobs-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { OK } from 'http-status'
import { z } from 'zod'

export async function companyOpenJobs(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const companyOpenJobsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = companyOpenJobsQuerySchema.parse(request.query)

  const fetchCompanyOpenJobsUseCase = makeFetchCompanyOpenJobsUseCase()
  const { jobs } = await fetchCompanyOpenJobsUseCase.execute({
    companyId: request.user.sub,
    page,
  })

  return reply.status(OK).send(jobs)
}
