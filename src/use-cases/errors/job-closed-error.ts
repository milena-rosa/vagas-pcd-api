import { PRECONDITION_FAILED } from 'http-status'
import { AppError } from './app-error'

export class JobClosedError extends AppError {
  constructor() {
    super('Job closed.', PRECONDITION_FAILED)
  }
}
