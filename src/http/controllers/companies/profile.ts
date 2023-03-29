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

  const getCompanyProfile = makeGetCompanyProfileUseCase()
  const { company } = await getCompanyProfile.execute({ cnpj })

  return reply.status(OK).send({
    ...company,
    password_hash: undefined,
  })
}
