import { buildJsonSchemas } from 'fastify-zod'
import { z } from 'zod'

const governmentUserInput = {
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
}

const governmentUserGenerated = {
  user_id: z.string().uuid(),
  created_at: z.date(),
  password_hash: z.string(),
}

const createGovernmentUserSchema = z.object({
  ...governmentUserInput,
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
})

const createGovernmentUserReplySchema = z.object({
  ...governmentUserInput,
  ...governmentUserGenerated,
})

export type CreateGovernmentUserInput = z.infer<
  typeof createGovernmentUserSchema
>

export type CreateGovernmentUserReply = z.infer<
  typeof createGovernmentUserReplySchema
>

export const { schemas: governmentUserSchemas, $ref } = buildJsonSchemas(
  {
    createGovernmentUserSchema,
    createGovernmentUserReplySchema,
  },
  { $id: 'government-user' },
)
