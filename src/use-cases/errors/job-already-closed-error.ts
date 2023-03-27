import { AppError } from './app-error'

export class JobAlreadyClosedError extends AppError {
  constructor() {
    super('Job already closed.', 409)
  }
}
