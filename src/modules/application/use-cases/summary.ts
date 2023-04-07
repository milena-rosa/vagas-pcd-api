import { ApplicationsRepository } from '@/repositories/applications-repository'
import { Summary } from '../application.schema'

export class SummaryUseCase {
  constructor(private applicationsRepository: ApplicationsRepository) {}

  async execute(): Promise<{ summary: Summary }> {
    const summary = await this.applicationsRepository.countJobsAndApplications()
    return { summary }
  }
}
