import { CONFLICT } from 'http-status'
import { AppError } from './app-error'

export class EmailAlreadyRegisteredError extends AppError {
  constructor() {
    super('E-mail already registered.', CONFLICT)
  }
}
