export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public details?: unknown;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    // Ensure the prototype chain is correct
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static badRequest(message: string, code = 'BAD_REQUEST', details?: unknown) {
    return new ApiError(message, 400, code, details);
  }

  static unauthorized(message: string = 'Unauthorized', code = 'UNAUTHORIZED', details?: unknown) {
    return new ApiError(message, 401, code, details);
  }

  static forbidden(message: string = 'Forbidden', code = 'FORBIDDEN', details?: unknown) {
    return new ApiError(message, 403, code, details);
  }

  static notFound(message: string = 'Not Found', code = 'NOT_FOUND', details?: unknown) {
    return new ApiError(message, 404, code, details);
  }

  static internal(message: string = 'Internal Server Error', code = 'INTERNAL_ERROR', details?: unknown) {
    return new ApiError(message, 500, code, details);
  }
}
