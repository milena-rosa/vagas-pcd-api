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
  zipCode: z.string(),
  street: z.string(),
  number: z.string(),
  complement: z.string().nullable(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  phone: z.string(),
  linkedin: z.string().nullable(),
  professionalExperience: z.string().nullable(),
  educationalBackground: z.string().nullable(),
  skills: z.string().nullable(),
}

const candidateGenerated = {
  candidate_id: z.string().uuid(),
  password_hash: z.string(),
  created_at: z.date(),
}

export const candidateSchema = z.object({
  candidate_id: z.string().uuid(),
  ...candidateInput,
})

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

const candidateUpdateInput = {
  name: z.string().optional(),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email()
    .optional(),
  zipCode: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  phone: z.string().optional(),
  linkedin: z.string().nullable(),
  professionalExperience: z.string().nullable(),
  educationalBackground: z.string().nullable(),
  skills: z.string().nullable(),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .optional(),
  oldPassword: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .optional(),
}

const updateCandidateBodySchema = z
  .object(candidateUpdateInput)
  .refine((schema) => (schema.password ? !!schema.oldPassword : true), {
    message: 'The old password must be sent.',
  })

const updateCandidateSchema = z
  .object({ ...candidateUpdateInput, candidate_id: z.string().uuid() })
  .refine((schema) => (schema.password ? !!schema.oldPassword : true), {
    message: 'The old password must be sent.',
  })

const updateCandidateReplySchema = z.object({
  ...candidateInput,
  ...candidateGenerated,
})

const getCandidateProfileSchema = z.object({
  candidate_id: z.string().uuid(),
})

const candidateReplySchema = z.object({
  ...candidateInput,
  ...candidateGenerated,
})

export type CreateCandidateInput = z.infer<typeof createCandidateSchema>
export type CreateCandidateReply = z.infer<typeof createCandidateReplySchema>

export type UpdateCandidateInput = z.infer<typeof updateCandidateSchema>
export type UpdateCandidateBody = z.infer<typeof updateCandidateBodySchema>
export type UpdateCandidateReply = z.infer<typeof updateCandidateReplySchema>

export type GetCandidateProfileInput = z.infer<typeof getCandidateProfileSchema>
export type GetCandidateProfileReply = z.infer<typeof candidateReplySchema>

export const { schemas: candidateSchemas, $ref } = buildJsonSchemas(
  {
    candidateSchema,
    createCandidateSchema,
    createCandidateReplySchema,
    updateCandidateSchema,
    updateCandidateBodySchema,
    updateCandidateReplySchema,
    candidateReplySchema,
  },
  { $id: 'candidate' },
)
