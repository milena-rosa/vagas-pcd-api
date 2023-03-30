import { makeCreateJobUseCase } from '@/use-cases/jobs/factories/make-create-job-use-case'
import { DisabilityType, Location } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CREATED } from 'http-status'
import { z } from 'zod'

export async function createJob(request: FastifyRequest, reply: FastifyReply) {
  const createJobBodySchema = z.object({
    title: z.string(),
    description: z.string(),
    role: z.string(),
    salary: z.number().min(0),
    location: z.nativeEnum(Location),
    disabilityType: z.nativeEnum(DisabilityType),
  })

  const { title, description, role, salary, location, disabilityType } =
    createJobBodySchema.parse(request.body)

  const createJobUseCase = makeCreateJobUseCase()

  const { job } = await createJobUseCase.execute({
    companyId: request.user.sub,
    title,
    description,
    role,
    salary,
    location,
    disabilityType,
  })

  return reply.status(CREATED).send(job)
}
