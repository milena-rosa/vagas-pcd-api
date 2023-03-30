import { makeSearchJobsUseCase } from '@/use-cases/jobs/factories/make-search-jobs-use-case'
import { formatJobWithCompany } from '@/utils/format-job-with-company'
import { FastifyReply, FastifyRequest } from 'fastify'
import { OK } from 'http-status'
import { z } from 'zod'

export async function searchJobs(request: FastifyRequest, reply: FastifyReply) {
  const companyProfileQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = companyProfileQuerySchema.parse(request.query)

  const searchJobsUseCase = makeSearchJobsUseCase()

  const { jobs } = await searchJobsUseCase.execute({ query, page })

  return reply.status(OK).send(formatJobWithCompany(jobs))
}
