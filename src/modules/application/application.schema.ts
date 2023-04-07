import { buildJsonSchemas } from 'fastify-zod'
import { z } from 'zod'
import { candidateSchema } from '../candidate/candidate.schema'

const applicationGenerated = {
  id: z.string().uuid(),
  created_at: z.string(),
  job_id: z.string().uuid(),
  candidate_id: z.string().uuid(),
}

const createApplicationSchema = z.object({
  job_id: z.string().uuid(),
})

const createApplicationReplySchema = z.object({
  ...applicationGenerated,
})

const listApplicationsParamsSchema = z.object({
  job_id: z.string().uuid(),
})

const listApplicationsQuerystringSchema = z.object({
  page: z.coerce.number().min(1).default(1),
})

const listApplicationsReplySchema = z.object({
  job_id: z.string().uuid(),
  candidates: z.array(candidateSchema),
})

// const bla = z.object({
//   candidate_id: z.string().uuid(),
//   applications: z.array(),
// })

export type CreateApplicationParams = z.infer<typeof createApplicationSchema>

export type ListApplicationParams = z.infer<typeof listApplicationsParamsSchema>

export type ListApplicationQuerystring = z.infer<
  typeof listApplicationsQuerystringSchema
>

export const { schemas: applicationSchemas, $ref } = buildJsonSchemas(
  {
    createApplicationSchema,
    createApplicationReplySchema,
    listApplicationsParamsSchema,
    listApplicationsQuerystringSchema,
    listApplicationsReplySchema,
  },
  { $id: 'application' },
)
