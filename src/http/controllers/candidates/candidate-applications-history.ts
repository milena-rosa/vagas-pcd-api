import {
  DisabilityTypeDictionary,
  LocationDictionary,
} from '@/repositories/jobs-repository'
import { makeFetchCandidateApplicationsHistoryUseCase } from '@/use-cases/applications/factories/make-fetch-candidate-applications-history-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { OK } from 'http-status'
import { z } from 'zod'

export async function candidateApplicationsHistory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const candidateApplicationsHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = candidateApplicationsHistoryQuerySchema.parse(request.query)

  const fetchCandidateApplicationsHistoryUseCase =
    makeFetchCandidateApplicationsHistoryUseCase()

  const { applications } =
    await fetchCandidateApplicationsHistoryUseCase.execute({
      candidateId: request.user.sub,
      page,
    })

  const formattedApplications = {
    candidate_id: request.user.sub,
    jobs: applications.map((application) => ({
      application_id: application.id,
      job_id: application.job.id,
      ...application.job.company,
      title: application.job.title,
      description: application.job.description,
      role: application.job.role,
      salary: application.job.salary,
      location: LocationDictionary[application.job.location],
      disability_type:
        DisabilityTypeDictionary[application.job.disability_type],
      job_created_at: application.job.created_at,
      job_closed_at: application.job.closed_at,
      applied_at: application.created_at,
    })),
  }

  return reply.status(OK).send(formattedApplications)
}
