import { FastifyReply, FastifyRequest } from 'fastify'
import { CREATED, OK } from 'http-status'
import { CompanyProfileParams, CreateCompanyInput } from './company.schema'
import { makeGetCompanyProfileUseCase } from './use-cases/factories/make-get-company-profile-use-case'
import { makeRegisterCompanyUseCase } from './use-cases/factories/make-register-company-use-case'

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
