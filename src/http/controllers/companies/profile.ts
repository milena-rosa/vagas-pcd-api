import { makeGetCompanyProfileUseCase } from '@/use-cases/companies/factories/make-get-company-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { OK } from 'http-status'
import { z } from 'zod'

export async function companyProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const companyProfileQuerySchema = z.object({
    company_id: z.string().uuid(),
  })

  const { company_id } = companyProfileQuerySchema.parse(request.query)

  const getCompanyProfileUseCase = makeGetCompanyProfileUseCase()
  const { company } = await getCompanyProfileUseCase.execute({
    companyId: company_id,
  })

  return reply.status(OK).send({
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
