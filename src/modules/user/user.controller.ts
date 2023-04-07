import { AuthenticateRequest } from '@/modules/user/user.schema'
import { FastifyReply, FastifyRequest } from 'fastify'
import { OK } from 'http-status'
import { makeAuthenticateUserUseCase } from './use-cases/factories/make-authenticate-user-use-case'

export async function authenticate(
  request: FastifyRequest<{ Body: AuthenticateRequest }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body

  const authenticateUseCase = makeAuthenticateUserUseCase()

  const { user } = await authenticateUseCase.execute({ email, password })

  const token = await reply.jwtSign(
    { role: user.role },
    { sign: { sub: user.user_id } },
  )

  const refreshToken = await reply.jwtSign(
    { role: user.role },
    { sign: { sub: user.user_id, expiresIn: '7d' } },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(OK)
    .send({ token })
}

export async function refreshToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.jwtVerify({ onlyCookie: true })

  const token = await reply.jwtSign(
    { role: request.user.role },
    { sign: { sub: request.user.sub } },
  )

  const refreshToken = await reply.jwtSign(
    { role: request.user.role },
    { sign: { sub: request.user.sub, expiresIn: '7d' } },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(OK)
    .send({ token })
}
