import { server } from '@/app'
import { Role } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CREATED, NOT_FOUND, OK } from 'http-status'
import {
  AuthenticateGovernmentUserRequest,
  CreateGovernmentUserInput,
  RecoverGovernmentUserQuerystring,
} from './government-user.schema'
import { makeAuthenticateGovernmentUserUseCase } from './use-cases/factories/make-authenticate-government-user-use-case'
import { makeGetGovernmentUserProfileUseCase } from './use-cases/factories/make-get-government-user-profile-use-case'
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
    .send({
      token,
      user: {
        ...governmentUser,
        role: Role.GOVERNMENT,
      },
    })
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

export async function recoverGovernmentUser(
  request: FastifyRequest<{ Querystring: RecoverGovernmentUserQuerystring }>,
  reply: FastifyReply,
) {
  const { token } = request.query

  const decoded = server.jwt.decode(token) as {
    role: string
    sub: string
    iat: number
    exp: number
  }

  if (!decoded) {
    return reply.status(NOT_FOUND).send()
  }

  const getCandidateProfileUseCase = makeGetGovernmentUserProfileUseCase()
  const { governmentUser } = await getCandidateProfileUseCase.execute({
    user_id: decoded.sub,
  })

  return reply.status(OK).send(governmentUser)
}
