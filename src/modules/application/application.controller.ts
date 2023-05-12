import { FastifyReply, FastifyRequest } from 'fastify'
import { CREATED, OK } from 'http-status'
import {
  CreateApplicationParams,
  ListJobApplicationParams,
  ListJobApplicationQuerystring,
} from './application.schema'
import { makeCreateApplicationUseCase } from './use-cases/factories/make-create-application-use-case'
import { makeExportSummaryCsvUseCase } from './use-cases/factories/make-export-summary-csv-use-case'
import { makeFetchCandidateApplicationsHistoryUseCase } from './use-cases/factories/make-fetch-candidate-applications-history-use-case'
import { makeListApplicationsUseCase } from './use-cases/factories/make-list-applications-use-case'
import { makeSummaryUseCase } from './use-cases/factories/make-summary-use-case'

export async function createApplication(
  request: FastifyRequest<{ Params: CreateApplicationParams }>,
  reply: FastifyReply,
) {
  const { job_id } = request.params

  const createApplicationUseCase = makeCreateApplicationUseCase()

  await createApplicationUseCase.execute({
    candidate_id: request.user.sub,
    job_id,
  })

  return reply.status(CREATED).send()
}

export async function listJobApplications(
  request: FastifyRequest<{
    Params: ListJobApplicationParams
    Querystring: ListJobApplicationQuerystring
  }>,
  reply: FastifyReply,
) {
  const { page } = request.query
  const { job_id } = request.params

  const fetchJobCandidatesUseCase = makeListApplicationsUseCase()

  const { job_role, job_title, job_description, candidates } =
    await fetchJobCandidatesUseCase.execute({
      job_id,
      page,
    })

  return reply
    .status(OK)
    .send({ job_id, job_role, job_title, job_description, candidates })
}

export async function listAllCandidateApplications(
  request: FastifyRequest<{
    Querystring: ListJobApplicationQuerystring
  }>,
  reply: FastifyReply,
) {
  const { page } = request.query

  const fetchCandidateApplicationsHistoryUseCase =
    makeFetchCandidateApplicationsHistoryUseCase()

  const {
    candidate_id,
    jobs,
    page: pageResponse,
  } = await fetchCandidateApplicationsHistoryUseCase.execute({
    candidate_id: request.user.sub,
    page,
  })

  return reply.status(OK).send({
    candidate_id,
    jobs,
    page: pageResponse,
  })
}

export async function summary(request: FastifyRequest, reply: FastifyReply) {
  const summaryUseCase = makeSummaryUseCase()

  const { summary } = await summaryUseCase.execute()

  return reply.status(OK).send(summary)
}

export async function exportSummaryCsv(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const exportSummaryCsvUseCase = makeExportSummaryCsvUseCase()

  const csvData = await exportSummaryCsvUseCase.execute()

  return reply.status(OK).send(csvData)
}
