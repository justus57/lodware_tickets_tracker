import { DomainError } from '../../../domain/errors/DomainError.js';
import { ValidationError } from '../../../domain/errors/ValidationError.js';
import { env } from '../../../infrastructure/config/env.js';

/**
 * Central Express error handler.
 */
export function errorHandler(err, _req, res, _next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  if (err instanceof DomainError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  if (err?.name === 'ZodError') {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.errors?.map((e) => ({
          path: e.path?.join('.') ?? '',
          message: e.message,
        })),
      },
    });
  }

  console.error(err);

  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: env.isProduction ? 'Internal server error' : err.message,
    },
  });
}
