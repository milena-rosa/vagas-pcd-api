import { FastifyReply, FastifyRequest } from 'fastify'
import { CREATED, OK } from 'http-status'
import {
  CloseJobParams,
  CreateJobInput,
  JobListQuerystring,
  SearchJobQuerystring,
} from './job.schema'
import { makeCloseJobUseCase } from './use-cases/factories/make-close-job-use-case'
import { makeCreateJobUseCase } from './use-cases/factories/make-create-job-use-case'
import { makeFetchCompanyJobsHistoryUseCase } from './use-cases/factories/make-fetch-company-jobs-history-use-case'
import { makeFetchCompanyOpenJobsUseCase } from './use-cases/factories/make-fetch-company-open-jobs-use-case'
import { makeSearchJobsUseCase } from './use-cases/factories/make-search-jobs-use-case'

export async function createJob(
  request: FastifyRequest<{ Body: CreateJobInput }>,
  reply: FastifyReply,
) {
  const {
    title,
    description,
    role,
    linkedin,
    salary,
    perks,
    location,
    disability_type,
  } = request.body

  const createJobUseCase = makeCreateJobUseCase()

  const { job } = await createJobUseCase.execute({
    company_id: request.user.sub,
    title,
    description,
    role,
    linkedin,
    salary,
    perks,
    location,
    disability_type,
  })

  return reply.status(CREATED).send(job)
}

export async function closeJob(
  request: FastifyRequest<{ Params: CloseJobParams }>,
  reply: FastifyReply,
) {
  const { job_id } = request.params

  const closeJobUseCase = makeCloseJobUseCase()

  const { job } = await closeJobUseCase.execute({ job_id })

  return reply.status(OK).send(job)
}

export async function searchJobs(
  request: FastifyRequest<{ Querystring: SearchJobQuerystring }>,
  reply: FastifyReply,
) {
  const { page, query } = request.query

  const searchJobsUseCase = makeSearchJobsUseCase()

  const { jobs } = await searchJobsUseCase.execute({ query, page })

  return reply.status(OK).send(jobs)
}

export async function companyJobsHistory(
  request: FastifyRequest<{ Querystring: JobListQuerystring }>,
  reply: FastifyReply,
) {
  const { page } = request.query

  const fetchCompanyJobsHistoryUseCase = makeFetchCompanyJobsHistoryUseCase()
  const { jobs } = await fetchCompanyJobsHistoryUseCase.execute({
    company_id: request.user.sub,
    page,
  })

  return reply.status(OK).send(jobs)
}

export async function companyOpenJobs(
  request: FastifyRequest<{ Querystring: JobListQuerystring }>,
  reply: FastifyReply,
) {
  const { page } = request.query

  const fetchCompanyOpenJobsUseCase = makeFetchCompanyOpenJobsUseCase()
  const { jobs } = await fetchCompanyOpenJobsUseCase.execute({
    company_id: request.user.sub,
    page,
  })

  return reply.status(OK).send(jobs)
}
