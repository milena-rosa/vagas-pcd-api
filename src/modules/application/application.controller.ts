import { FastifyReply, FastifyRequest } from 'fastify'
import { CREATED, OK } from 'http-status'
import {
  CreateApplicationParams,
  ListApplicationParams,
  ListApplicationQuerystring,
} from './application.schema'
import { makeCreateApplicationUseCase } from './use-cases/factories/make-create-application-use-case'
import { makeListApplicationsUseCase } from './use-cases/factories/make-list-applications-use-case'

export async function createApplication(
  request: FastifyRequest<{ Params: CreateApplicationParams }>,
  reply: FastifyReply,
) {
  const { job_id: jobId } = request.params

  const createApplicationUseCase = makeCreateApplicationUseCase()

  await createApplicationUseCase.execute({
    candidateId: request.user.sub,
    jobId,
  })

  return reply.status(CREATED).send()
}

export async function listApplications(
  request: FastifyRequest<{
    Params: ListApplicationParams
    Querystring: ListApplicationQuerystring
  }>,
  reply: FastifyReply,
) {
  const { page } = request.query
  const { job_id } = request.params

  const fetchJobCandidatesUseCase = makeListApplicationsUseCase()

  const { candidates } = await fetchJobCandidatesUseCase.execute({
    jobId: job_id,
    page,
  })

  const formattedCandidates = {
    job_id,
    candidates: candidates.map((candidate) => ({
      candidate_id: candidate.candidate_id,
      name: candidate.name,
      email: candidate.user.email,
      phone: candidate.phone,
      resume: candidate.resume,
    })),
  }

  return reply.status(OK).send(formattedCandidates)
}
