import {
  DisabilityTypeDictionary,
  LocationDictionary,
} from '@/repositories/jobs-repository'
import { makeSearchJobsUseCase } from '@/use-cases/jobs/factories/make-search-jobs-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { OK } from 'http-status'
import { z } from 'zod'

export async function searchJobs(request: FastifyRequest, reply: FastifyReply) {
  const companyProfileQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = companyProfileQuerySchema.parse(request.query)

  const searchJobsUseCase = makeSearchJobsUseCase()

  const { jobs } = await searchJobsUseCase.execute({ query, page })

  const formattedJobs = jobs.map((job) => ({
    company_id: job.company_id,
    cnpj: job.company.cnpj,
    name: job.company.name,
    email: job.company.user.email,
    phone: job.company.phone,
    street: job.company.street,
    zipCode: job.company.zipCode,
    number: job.company.number,
    complement: job.company.complement,
    city: job.company.city,
    state: job.company.state,
    job_id: job.id,
    title: job.title,
    description: job.description,
    role: job.role,
    salary: job.salary,
    location: LocationDictionary[job.location],
    disability_type: DisabilityTypeDictionary[job.disability_type],
    created_at: job.created_at,
    closed_at: job.closed_at,
  }))

  return reply.status(OK).send(formattedJobs)
}
