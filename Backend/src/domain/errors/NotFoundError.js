import { DomainError } from './DomainError.js';

export class NotFoundError extends DomainError {
  constructor(resource = 'Resource', id) {
    const suffix = id != null ? ` with id "${id}"` : '';
    super(`${resource}${suffix} not found`, 404, 'NOT_FOUND');
  }
}
