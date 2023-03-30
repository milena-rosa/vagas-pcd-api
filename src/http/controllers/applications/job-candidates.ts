import { makeFetchJobCandidatesUseCase } from '@/use-cases/jobs/factories/make-fetch-job-candidates-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { OK } from 'http-status'
import { z } from 'zod'

export async function jobCandidates(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const jobCandidatesParamsSchema = z.object({
    job_id: z.string().uuid(),
  })

  const jobCandidatesQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = jobCandidatesQuerySchema.parse(request.query)
  const { job_id } = jobCandidatesParamsSchema.parse(request.params)

  const fetchJobCandidatesUseCase = makeFetchJobCandidatesUseCase()

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
