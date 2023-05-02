import { Role } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CREATED, OK } from 'http-status'
import {
  AuthenticateGovernmentUserRequest,
  CreateGovernmentUserInput,
} from './government-user.schema'
import { makeAuthenticateGovernmentUserUseCase } from './use-cases/factories/make-authenticate-government-user-use-case'
import { makeRegisterGovernmentUserUseCase } from './use-cases/factories/make-register-government-user-use-case'

export async function authenticateGovernmentUser(
  request: FastifyRequest<{ Body: AuthenticateGovernmentUserRequest }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body

  const authenticateUseCase = makeAuthenticateGovernmentUserUseCase()

  const { governmentUser } = await authenticateUseCase.execute({
    email,
    password,
  })

  const token = await reply.jwtSign(
    { role: Role.GOVERNMENT },
    { sign: { sub: governmentUser.user_id } },
  )

  const refreshToken = await reply.jwtSign(
    { role: Role.GOVERNMENT },
    { sign: { sub: governmentUser.user_id, expiresIn: '7d' } },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(OK)
    .send({ token, governmentUser })
}

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
