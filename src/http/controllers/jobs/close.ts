import { makeCloseJobUseCase } from '@/use-cases/jobs/factories/make-close-job-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { OK } from 'http-status'
import { z } from 'zod'

export async function closeJob(request: FastifyRequest, reply: FastifyReply) {
  const closeJobParamsSchema = z.object({
    jobId: z.string(),
  })

  const { jobId } = closeJobParamsSchema.parse(request.params)

  const closeJobUseCase = makeCloseJobUseCase()

  const { job } = await closeJobUseCase.execute({
    jobId,
  })

  return reply.status(OK).send({ ...job })
}
