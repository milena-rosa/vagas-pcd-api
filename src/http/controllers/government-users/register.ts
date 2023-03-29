import { makeRegisterGovernmentUserUseCase } from '@/use-cases/government-users/factories/make-register-government-user-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CREATED } from 'http-status'
import { z } from 'zod'

export async function registerGovernmentUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = registerBodySchema.parse(request.body)

  const registerUseCase = makeRegisterGovernmentUserUseCase()

  const { governmentUser } = await registerUseCase.execute({
    email,
    password,
  })

  return reply.status(CREATED).send({
    user_id: governmentUser.user_id,
    email: governmentUser.user.email,
    created_at: governmentUser.user.created_at,
  })
}
