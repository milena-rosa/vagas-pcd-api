import {
  DisabilityTypeDictionary,
  JobWithCompany,
  LocationDictionary,
} from '@/repositories/jobs-repository'

export function formatJobWithCompany(job: JobWithCompany) {
  return {
    company_id: job.company_id,
    cnpj: job.company.cnpj,
    name: job.company.name ?? '',
    email: job.company.user.email,
    phone: job.company.phone ?? '',
    street: job.company.street ?? '',
    zip_code: job.company.zip_code ?? '',
    number: job.company.number ?? '',
    complement: job.company.complement ?? '',
    city: job.company.city ?? '',
    state: job.company.state ?? '',
    job_id: job.job_id,
    title: job.title,
    description: job.description,
    role: job.role,
    salary: job.salary,
    location: LocationDictionary[job.location],
    disability_type: DisabilityTypeDictionary[job.disability_type],
    created_at: job.created_at,
    closed_at: job.closed_at,
  }
}
