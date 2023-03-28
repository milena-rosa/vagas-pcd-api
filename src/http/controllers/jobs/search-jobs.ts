import { makeSearchJobsUseCase } from '@/use-cases/jobs/factories/make-search-jobs-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function searchJobs(request: FastifyRequest, reply: FastifyReply) {
  const companyProfileQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = companyProfileQuerySchema.parse(request.query)

  const searchJobsUseCase = makeSearchJobsUseCase()
  const { jobs } = await searchJobsUseCase.execute({ query, page })

  return reply.status(200).send(jobs)
}
