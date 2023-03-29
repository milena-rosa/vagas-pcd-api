import { makeUpdateCandidateUseCase } from '@/use-cases/candidates/factories/make-update-candidate-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { OK } from 'http-status'
import { z } from 'zod'

export async function updateCandidate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateParamsSchema = z.object({
    id: z.string(),
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

  const { id } = updateParamsSchema.parse(request.params)
  const { name, email, phone, resume, password, oldPassword } =
    updateBodySchema.parse(request.body)

  const updateUseCase = makeUpdateCandidateUseCase()

  const { candidate } = await updateUseCase.execute({
    id,
    name,
    email,
    phone,
    resume,
    password,
    oldPassword,
  })

  return reply.status(OK).send({
    ...candidate,
    password_hash: undefined,
  })
}
