import {
  DisabilityTypeDictionary,
  LocationDictionary,
} from '@/repositories/jobs-repository'
import { DisabilityType, Job, Location } from '@prisma/client'

export interface JobSearchResponse {
  id: string
  title: string
  description: string
  role: string
  salary: number
  location: string
  disability_type: string
  created_at: Date
  company: {
    companyId: string
    cnpj: string
    name: string | null
    email: string
    phone: string | null
    street: string | null
    number: string | null
    complement: string | null
    city: string | null
    state: string | null
    zipCode: string | null
  }
}

// FIXME: any
function formatJob(job: any) {
  return {
    ...job,
    disability_type:
      DisabilityTypeDictionary[job.disability_type as DisabilityType],
    location: LocationDictionary[job.location as Location],
    company: {
      companyId: job.company.id,
      cnpj: job.company.cnpj,
      name: job.company.name,
      email: job.company.user.email,
      phone: job.company.phone,
      street: job.company.street,
      number: job.company.number,
      complement: job.company.complement,
      city: job.company.city,
      state: job.company.state,
      zipCode: job.company.zipCode,
    },
  }
}

export function formatJobWithCompany(jobs: Job[]) {
  return jobs.map(formatJob)
}
