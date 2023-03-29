import { makeAuthenticateCompanyUseCase } from '@/use-cases/companies/factories/make-authenticate-company-use-case'
import { validateCNPJ } from '@/utils/validate-cnpj'
import { FastifyReply, FastifyRequest } from 'fastify'
import { OK } from 'http-status'
import { z } from 'zod'

export async function authenticateCompany(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    emailOrCnpj: z
      .string()
      .email()
      .or(z.string().refine((value) => validateCNPJ(value))),
    password: z.string().min(6),
  })

  const { emailOrCnpj, password } = authenticateBodySchema.parse(request.body)

  const authenticateUseCase = makeAuthenticateCompanyUseCase()

  const { company } = await authenticateUseCase.execute({
    emailOrCnpj,
    password,
  })

  const token = await reply.jwtSign({}, { sign: { sub: company.id } })
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
