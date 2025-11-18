import { AppError } from './AppError';

export class ValidationError extends AppError {
  constructor(message: string = 'Validation error') {
    super(message, 400);
  }
}
