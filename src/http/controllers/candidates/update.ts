import { makeUpdateCandidateUseCase } from '@/use-cases/candidates/factories/make-update-candidate-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { OK } from 'http-status'
import { z } from 'zod'

export async function updateCandidate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateParamsSchema = z.object({
    candidate_id: z.string(),
  })

  const updateBodySchema = z
    .object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().nullable().optional(),
      resume: z.string().optional(),
      password: z.string().min(6).optional(),
      oldPassword: z.string().optional(),
    })
    .refine((schema) => (schema.password ? !!schema.oldPassword : true), {
      message: 'The old password must be sent.',
    })

  const { candidate_id } = updateParamsSchema.parse(request.params)
  const { name, email, phone, resume, password, oldPassword } =
    updateBodySchema.parse(request.body)

  const updateUseCase = makeUpdateCandidateUseCase()

  const { candidate } = await updateUseCase.execute({
    candidateId: candidate_id,
    name,
    email,
    phone,
    resume,
    password,
    oldPassword,
  })

  return reply.status(OK).send({
    candidate_id: candidate.candidate_id,
    name: candidate.name,
    email: candidate.user.email,
    phone: candidate.phone,
    resume: candidate.resume,
    created_at: candidate.user.created_at,
  })
}
