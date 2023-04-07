import { FastifyReply, FastifyRequest } from 'fastify'
import { CREATED } from 'http-status'
import { CreateGovernmentUserInput } from './government-user.schema'
import { makeRegisterGovernmentUserUseCase } from './use-cases/factories/make-register-government-user-use-case'

export async function registerGovernmentUser(
  request: FastifyRequest<{ Body: CreateGovernmentUserInput }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body

  const registerUseCase = makeRegisterGovernmentUserUseCase()

  const { governmentUser } = await registerUseCase.execute({
    email,
    password,
  })

  return reply.status(CREATED).send(governmentUser)
}
