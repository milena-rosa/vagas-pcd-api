import { FORBIDDEN } from 'http-status'
import { AppError } from './app-error'

export class NotAllowedEmailError extends AppError {
  constructor() {
    super('E-mail not allowed.', FORBIDDEN)
  }
}
