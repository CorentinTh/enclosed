import type { StatusCode } from 'hono/utils/http-status';
import { get, isError, toString } from 'lodash-es';

export { createError, createErrorFactory, isCustomError };

type ErrorOptions = {
  message: string;
  code: string;
  cause?: unknown;
  statusCode: StatusCode;
  documentationUrl?: string;
  isInternal?: boolean;
};

class CustomError extends Error {
  code: string;
  cause?: Error | null;
  statusCode: StatusCode;
  isCustomError = true;
  documentationUrl?: string;
  isInternal?: boolean;

  constructor({ message, code, cause, statusCode, documentationUrl, isInternal }: ErrorOptions) {
    super(message);

    this.code = code;
    this.cause = isError(cause) ? cause : new Error(toString(cause));
    this.statusCode = statusCode;
    this.documentationUrl = documentationUrl;
    this.isInternal = isInternal;
  }
}

function createError(options: ErrorOptions) {
  return new CustomError(options);
}

function createErrorFactory(baseOption: ErrorOptions) {
  return (options: Partial<ErrorOptions> = {}) => {
    return createError({ ...baseOption, ...options });
  };
}

function isCustomError(error: unknown): error is CustomError {
  return get(error, 'isCustomError') === true;
}
