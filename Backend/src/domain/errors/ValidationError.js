import { DomainError } from './DomainError.js';

export class ValidationError extends DomainError {
  constructor(message = 'Validation failed', details = []) {
    super(message, 422, 'VALIDATION_ERROR');
    this.details = details;
  }
}
