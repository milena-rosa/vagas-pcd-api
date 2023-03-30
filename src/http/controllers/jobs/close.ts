import { makeCloseJobUseCase } from '@/use-cases/jobs/factories/make-close-job-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { OK } from 'http-status'
import { z } from 'zod'

export async function closeJob(request: FastifyRequest, reply: FastifyReply) {
  const closeJobParamsSchema = z.object({
    job_id: z.string(),
  })

  const { job_id } = closeJobParamsSchema.parse(request.params)

  const closeJobUseCase = makeCloseJobUseCase()

  const { job } = await closeJobUseCase.execute({ jobId: job_id })

  return reply.status(OK).send(job)
}
