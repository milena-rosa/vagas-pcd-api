import { buildJsonSchemas } from 'fastify-zod'
import { z } from 'zod'

const candidateInput = {
  name: z.string(),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  phone: z.string().nullable(),
  resume: z.string().nullable(),
}

const candidateGenerated = {
  candidate_id: z.string().uuid(),
  created_at: z.string(),
}

const createCandidateSchema = z.object({
  ...candidateInput,
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
})

const createCandidateReplySchema = z.object({
  ...candidateInput,
  ...candidateGenerated,
})

const updateCandidateSchema = z
  .object({
    ...candidateInput,
    password: z.string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    }),
    oldPassword: z.string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    }),
  })
  .refine((schema) => (schema.password ? !!schema.oldPassword : true), {
    message: 'The old password must be sent.',
  })

const updateCandidateReplySchema = z.object({
  ...candidateInput,
  ...candidateGenerated,
})

const candidateReplySchema = z.object({
  ...candidateInput,
  ...candidateGenerated,
})

export type CreateCandidateInput = z.infer<typeof createCandidateSchema>

export type UpdateCandidateInput = z.infer<typeof updateCandidateSchema>

export const { schemas: candidateSchemas, $ref } = buildJsonSchemas(
  {
    createCandidateSchema,
    createCandidateReplySchema,
    updateCandidateSchema,
    updateCandidateReplySchema,
    candidateReplySchema,
  },
  { $id: 'Candidate' },
)
