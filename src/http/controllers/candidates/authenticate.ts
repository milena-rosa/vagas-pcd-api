import { makeAuthenticateCandidateUseCase } from '@/use-cases/candidates/factories/make-authenticate-candidate-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { OK } from 'http-status'
import { z } from 'zod'

export async function authenticateCandidate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  const authenticateUseCase = makeAuthenticateCandidateUseCase()

  const { candidate } = await authenticateUseCase.execute({ email, password })

  const token = await reply.jwtSign(
    // { role: candidate.role },
    {},
    { sign: { sub: candidate.id } },
  )
  // const refreshToken = await reply.jwtSign(
  //   // { role: user.role },
  //   { sign: { sub: candidate.id, expiresIn: '7d' } },
  // )

  return (
    reply
      // .setCookie('refreshToken', refreshToken, {
      //   path: '/',
      //   secure: true,
      //   sameSite: true,
      //   httpOnly: true,
      // })
      .status(OK)
      .send({ token })
  )
}
