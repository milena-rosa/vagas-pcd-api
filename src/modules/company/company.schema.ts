import { buildJsonSchemas } from 'fastify-zod'
import { z } from 'zod'

const companyInput = {
  cnpj: z.string(),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
}

const companyGenerated = {
  company_id: z.string().uuid(),
  name: z.string(),
  phone: z.string(),
  street: z.string(),
  number: z.string(),
  complement: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  created_at: z.string(),
}

const createCompanySchema = z.object({
  ...companyInput,
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
})

const createCompanyReplySchema = z.object({
  ...companyInput,
  ...companyGenerated,
})

const companyReplySchema = z.object({
  ...companyInput,
  ...companyGenerated,
})

const companyProfileSchema = z.object({
  company_id: z.string().uuid(),
})

export type CreateCompanyInput = z.infer<typeof createCompanySchema>

export type CompanyProfileParams = z.infer<typeof companyProfileSchema>

export const { schemas: companySchemas, $ref } = buildJsonSchemas(
  {
    createCompanySchema,
    createCompanyReplySchema,
    companyProfileSchema,
    companyReplySchema,
  },
  { $id: 'Company' },
)
