import { buildJsonSchemas } from 'fastify-zod'
import { z } from 'zod'
import { candidateSchema } from '../candidate/candidate.schema'

const applicationGenerated = {
  id: z.string().uuid(),
  created_at: z.date(),
  job_id: z.string().uuid(),
  candidate_id: z.string().uuid(),
}

const createApplicationInputSchema = z.object({
  job_id: z.string().uuid(),
  candidate_id: z.string().uuid(),
})

const createApplicationSchema = z.object({
  job_id: z.string().uuid(),
})

const createApplicationReplySchema = z.object({
  ...applicationGenerated,
})

const listJobApplicationsInputSchema = z.object({
  job_id: z.string().uuid(),
  page: z.coerce.number().min(1).default(1).optional(),
})

const listJobApplicationsParamsSchema = z.object({
  job_id: z.string().uuid(),
})

const listJobApplicationsQuerystringSchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
})

const listJobApplicationsReplySchema = z.object({
  job_id: z.string().uuid(),
  candidates: z.array(candidateSchema),
})

const listCandidateApplicationsInputSchema = z.object({
  candidate_id: z.string().uuid(),
  page: z.coerce.number().min(1).default(1).optional(),
})

const listCandidateApplicationsQuerystringSchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
})

const applicationSchema = z.object({
  application_id: z.string().uuid(),
  company_name: z.string(),
  company_city: z.string(),
  company_state: z.string(),
  job_id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  role: z.string(),
  salary: z.number(),
  location: z.string(),
  disability_type: z.string(),
  job_created_at: z.date(),
  job_closed_at: z.date().nullable(),
  applied_at: z.date(),
})

const listCandidateApplicationsReplySchema = z.object({
  candidate_id: z.string().uuid(),
  jobs: z.array(applicationSchema),
  page: z.number(),
})

// const bla = z.object({
//   candidate_id: z.string().uuid(),
//   applications: z.array(),
// })

export type CreateApplicationParams = z.infer<typeof createApplicationSchema>
export type CreateApplicationInput = z.infer<
  typeof createApplicationInputSchema
>
export type CreateApplicationReply = z.infer<
  typeof createApplicationReplySchema
>

export type ListJobApplicationInput = z.infer<
  typeof listJobApplicationsInputSchema
>
export type ListJobApplicationParams = z.infer<
  typeof listJobApplicationsParamsSchema
>
export type ListJobApplicationQuerystring = z.infer<
  typeof listJobApplicationsQuerystringSchema
>
export type ListJobApplicationsReply = z.infer<
  typeof listJobApplicationsReplySchema
>

export type ListCandidateApplicationInput = z.infer<
  typeof listCandidateApplicationsInputSchema
>
export type ListCandidateApplicationQuerystring = z.infer<
  typeof listCandidateApplicationsQuerystringSchema
>
export type ListCandidateApplicationsReply = z.infer<
  typeof listCandidateApplicationsReplySchema
>

export const { schemas: applicationSchemas, $ref } = buildJsonSchemas(
  {
    createApplicationSchema,
    createApplicationReplySchema,
    createApplicationInputSchema,
    listJobApplicationsParamsSchema,
    listJobApplicationsQuerystringSchema,
    listJobApplicationsReplySchema,
    listJobApplicationsInputSchema,
    listCandidateApplicationsQuerystringSchema,
    listCandidateApplicationsReplySchema,
    listCandidateApplicationsInputSchema,
  },
  { $id: 'application' },
)
