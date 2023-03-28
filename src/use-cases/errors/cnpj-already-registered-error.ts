import { CONFLICT } from 'http-status'
import { AppError } from './app-error'

export class CNPJAlreadyRegisteredError extends AppError {
  constructor() {
    super('CNPJ already registered.', CONFLICT)
  }
}
