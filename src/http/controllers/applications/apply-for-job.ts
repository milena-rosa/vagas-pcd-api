import { makeApplyForJobUseCase } from '@/use-cases/applications/factories/make-apply-for-job-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CREATED } from 'http-status'
import { z } from 'zod'

export async function applyForJob(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const applyForJobParamsSchema = z.object({
    job_id: z.string().uuid(),
  })

  const { job_id } = applyForJobParamsSchema.parse(request.params)

  const applyForJobUseCase = makeApplyForJobUseCase()

  await applyForJobUseCase.execute({
    candidateId: request.user.sub,
    jobId: job_id,
  })

  return reply.status(CREATED).send()
}
