import {
  DisabilityTypeDictionary,
  LocationDictionary,
} from '@/repositories/jobs-repository'
import { makeFetchCandidateOpenApplicationsUseCase } from '@/use-cases/applications/factories/make-fetch-candidate-open-applications-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { OK } from 'http-status'
import { z } from 'zod'

export async function candidateOpenApplications(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const candidateApplicationsHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = candidateApplicationsHistoryQuerySchema.parse(request.query)

  const fetchCandidateOpenApplicationsUseCase =
    makeFetchCandidateOpenApplicationsUseCase()

  const { applications } = await fetchCandidateOpenApplicationsUseCase.execute({
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
      job_created_at: application.created_at,
      applied_at: application.created_at,
    })),
  }

  return reply.status(OK).send(formattedApplications)
}
