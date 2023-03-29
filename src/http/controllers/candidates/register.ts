import { makeRegisterCandidateUseCase } from '@/use-cases/candidates/factories/make-register-candidate-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CREATED } from 'http-status'
import { z } from 'zod'

export async function registerCandidate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().nullable(),
    resume: z.string().nullable(),
    password: z.string().min(6),
  })

  const { name, email, password, phone, resume } = registerBodySchema.parse(
    request.body,
  )

  const registerUseCase = makeRegisterCandidateUseCase()

  const { candidate } = await registerUseCase.execute({
    name,
    email,
    password,
    phone,
    resume: resume ?? '',
  })

  return reply.status(CREATED).send({
    user_id: candidate.user_id,
    email: candidate.user.email,
    name: candidate.name,
    phone: candidate.phone,
    resume: candidate.resume,
    created_at: candidate.user.created_at,
  })
}
