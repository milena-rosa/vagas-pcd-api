import { makeGetCompanyProfileUseCase } from '@/use-cases/companies/factories/make-get-company-profile-use-case'
import { validateCNPJ } from '@/utils/validate-cnpj'
import { FastifyReply, FastifyRequest } from 'fastify'
import { OK } from 'http-status'
import { z } from 'zod'

export async function companyProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const companyProfileQuerySchema = z.object({
    cnpj: z.string().refine((value) => validateCNPJ(value)),
  })

  const { cnpj } = companyProfileQuerySchema.parse(request.query)

  const getCompanyProfileUseCase = makeGetCompanyProfileUseCase()
  const { company } = await getCompanyProfileUseCase.execute({ cnpj })

  return reply.status(OK).send({
    user_id: company.user_id,
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
