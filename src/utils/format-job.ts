import {
  DisabilityTypeDictionary,
  JobWithApplications,
  LocationDictionary,
} from '@/repositories/jobs-repository'

export function formatJob(job: JobWithApplications) {
  return {
    company_id: job.company_id,
    job_id: job.job_id,
    title: job.title,
    description: job.description,
    role: job.role,
    linkedin: job.linkedin ?? '',
    disability_type: DisabilityTypeDictionary[job.disability_type],
    location: LocationDictionary[job.location],
    salary: job.salary,
    perks: job.perks,
    created_at: job.created_at,
    closed_at: job.closed_at,
    n_applications: job.applications.length,
  }
}
