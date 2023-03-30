import { makeApplyForJobUseCase } from '@/use-cases/applications/factories/make-apply-for-job-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CREATED } from 'http-status'
import { z } from 'zod'

export async function applyForJob(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const applyForJobParamsSchema = z.object({
    jobId: z.string().uuid(),
  })

  const { jobId } = applyForJobParamsSchema.parse(request.params)

  const applyForJobUseCase = makeApplyForJobUseCase()

  await applyForJobUseCase.execute({
    candidateId: request.user.sub,
    jobId,
  })

  return reply.status(CREATED).send()
}
