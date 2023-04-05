import { FastifyReply, FastifyRequest } from 'fastify'
import { OK } from 'http-status'

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
    // { role: user.role },
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
