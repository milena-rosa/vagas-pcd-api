import { Role } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CREATED, OK } from 'http-status'
import {
  AuthenticateCompanyRequest,
  CompanyProfileParams,
  CreateCompanyInput,
} from './company.schema'
import { makeAuthenticateCompanyUseCase } from './use-cases/factories/make-authenticate-company-use-case'
import { makeGetCompanyProfileUseCase } from './use-cases/factories/make-get-company-profile-use-case'
import { makeRegisterCompanyUseCase } from './use-cases/factories/make-register-company-use-case'

export async function authenticateCompany(
  request: FastifyRequest<{ Body: AuthenticateCompanyRequest }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body

  const authenticateUseCase = makeAuthenticateCompanyUseCase()

  const { company } = await authenticateUseCase.execute({ email, password })

  const token = await reply.jwtSign(
    { role: Role.COMPANY },
    { sign: { sub: company.company_id } },
  )

  const refreshToken = await reply.jwtSign(
    { role: Role.COMPANY },
    { sign: { sub: company.company_id, expiresIn: '7d' } },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(OK)
    .send({ token, company })
}

export async function registerCompany(
  request: FastifyRequest<{ Body: CreateCompanyInput }>,
  reply: FastifyReply,
) {
  const { cnpj, email, password } = request.body

  const registerUseCase = makeRegisterCompanyUseCase()

  const { company } = await registerUseCase.execute({
    cnpj,
    email,
    password,
  })

  return reply.status(CREATED).send(company)
}

export async function companyProfile(
  request: FastifyRequest<{ Params: CompanyProfileParams }>,
  reply: FastifyReply,
) {
  const { company_id } = request.params

  const getCompanyProfileUseCase = makeGetCompanyProfileUseCase()
  const { company } = await getCompanyProfileUseCase.execute({
    company_id,
  })

  return reply.status(OK).send(company)
}
