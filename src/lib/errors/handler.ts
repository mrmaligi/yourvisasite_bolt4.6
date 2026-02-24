import { ApiError } from './api.error';
import { PostgrestError } from '@supabase/supabase-js';

export function errorHandler(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  // Handle Supabase PostgrestError
  if (isPostgrestError(error)) {
    // Map Postgres error codes to status codes
    const code = error.code;
    let statusCode = 500;

    // https://www.postgresql.org/docs/current/errcodes-appendix.html
    if (code.startsWith('23')) { // Integrity Constraint Violation
      statusCode = 400; // Likely bad input (e.g., duplicate key)
    } else if (code === 'PGRST116') { // JSON object requested, multiple (or no) rows returned
      statusCode = 404;
    } else if (code.startsWith('42')) { // Syntax Error or Access Rule Violation
      statusCode = 400;
    }

    return new ApiError(error.message, statusCode, error.code, error.details);
  }

  // Handle generic Error
  if (error instanceof Error) {
    return new ApiError(error.message, 500, 'INTERNAL_ERROR', { originalError: error });
  }

  // Handle unknown errors
  return new ApiError('An unexpected error occurred', 500, 'UNKNOWN_ERROR', { originalError: error });
}

function isPostgrestError(error: any): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'code' in error &&
    'details' in error &&
    'hint' in error
  );
}
