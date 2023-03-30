import { makeRegisterCompanyUseCase } from '@/use-cases/companies/factories/make-register-company-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CREATED } from 'http-status'
import { z } from 'zod'

export async function registerCompany(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    cnpj: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { cnpj, email, password } = registerBodySchema.parse(request.body)

  const registerUseCase = makeRegisterCompanyUseCase()

  const { company } = await registerUseCase.execute({
    cnpj,
    email,
    password,
  })

  return reply.status(CREATED).send({
    company_id: company.company_id,
    cnpj: company.cnpj,
    name: company.name,
    email: company.user.email,
    phone: company.phone,
    street: company.street,
    number: company.number,
    complement: company.complement,
    city: company.city,
    state: company.state,
    zipCode: company.zipCode,
    created_at: company.user.created_at,
  })
}
