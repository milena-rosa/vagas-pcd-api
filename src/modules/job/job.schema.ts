import { DisabilityType, Location } from '@prisma/client'
import { buildJsonSchemas } from 'fastify-zod'
import { z } from 'zod'

const jobInput = {
  title: z.string(),
  description: z.string(),
  role: z.string(),
  salary: z.number().min(0),
  perks: z.string(),
  linkedin: z.string(),
  location: z.nativeEnum(Location),
  disability_type: z.nativeEnum(DisabilityType),
}

const jobGenerated = {
  // company_id: z.string().uuid(),
  job_id: z.string().uuid(),
  created_at: z.date(),
  closed_at: z.date().nullable(),
}

export const jobSchema = z.object({
  job_id: z.string().uuid(),
  ...jobInput,
})

const createJobBodySchema = z.object({
  ...jobInput,
})

const createJobSchema = z.object({
  company_id: z.string().uuid(),
  ...jobInput,
})

const createJobReplySchema = z.object({
  ...jobInput,
  ...jobGenerated,
  company_id: z.string().uuid(),
  location: z.string(),
  disability_type: z.string(),
})

const closeJobSchema = z.object({
  job_id: z.string().uuid(),
})

const closeJobReplySchema = z.object({
  ...jobInput,
  ...jobGenerated,
  location: z.string(),
  disability_type: z.string(),
})

const searchJobSchema = z.object({
  query: z.string(),
  page: z.coerce.number().min(1).default(1).optional(),
})

const searchJobReplySchema = z.array(
  z.object({
    ...jobInput,
    ...jobGenerated,
    location: z.string(),
    disability_type: z.string(),
    cnpj: z.string(),
    email: z.string().email(),
    name: z.string(),
    phone: z.string(),
    street: z.string(),
    number: z.string(),
    complement: z.string(),
    city: z.string(),
    state: z.string(),
    zip_code: z.string(),
  }),
)

const jobListSchema = z.object({
  page: z.coerce.number().min(1).default(1),
})

const jobListReplySchema = z.array(
  z.object({
    ...jobInput,
    ...jobGenerated,
    location: z.string(),
    disability_type: z.string(),
  }),
)

const companyJobsListSchema = z.object({
  company_id: z.string().uuid(),
  page: z.coerce.number().min(1).default(1).optional(),
})

export type CreateJobInput = z.infer<typeof createJobSchema>
export type CreateJobReply = z.infer<typeof createJobReplySchema>

export type CloseJobParams = z.infer<typeof closeJobSchema>
export type CloseJobReply = z.infer<typeof closeJobReplySchema>

export type SearchJobQuerystring = z.infer<typeof searchJobSchema>
export type SearchJobReply = z.infer<typeof searchJobReplySchema>

export type JobListQuerystring = z.infer<typeof jobListSchema>
export type JobListReply = z.infer<typeof jobListReplySchema>

export type CompanyJobsListInput = z.infer<typeof companyJobsListSchema>

export const { schemas: jobSchemas, $ref } = buildJsonSchemas(
  {
    createJobSchema,
    createJobBodySchema,
    createJobReplySchema,
    closeJobSchema,
    closeJobReplySchema,
    searchJobSchema,
    searchJobReplySchema,
    jobListSchema,
    jobListReplySchema,
    companyJobsHistorySchema: companyJobsListSchema,
  },
  { $id: 'job' },
)
