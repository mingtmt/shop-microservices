'use strict'

const { StatusCode, ErrorCode } = require('./constants')

class ErrorResponse extends Error {
  constructor({ message, statusCode, errorCode, errors = null, metadata = null }) {
    super(message)
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.isOperational = true

    if (errors) {
      this.errors = errors
    }

    if (metadata) {
      this.metadata = metadata
    }

    Error.captureStackTrace(this, this.constructor)
  }
}

class BadRequestError extends ErrorResponse {
  constructor({
    message = 'Bad Request',
    errorCode = ErrorCode.BAD_REQUEST,
    errors = null,
    metadata = null,
  } = {}) {
    super({
      message,
      statusCode: StatusCode.BAD_REQUEST,
      errorCode,
      errors,
      metadata,
    })
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor({ message = 'Unauthorized', errorCode = ErrorCode.UNAUTHORIZED } = {}) {
    super({
      message,
      statusCode: StatusCode.UNAUTHORIZED,
      errorCode,
    })
  }
}

class ForbiddenError extends ErrorResponse {
  constructor({ message = 'Forbidden', errorCode = ErrorCode.FORBIDDEN } = {}) {
    super({
      message,
      statusCode: StatusCode.FORBIDDEN,
      errorCode,
    })
  }
}

class NotFoundError extends ErrorResponse {
  constructor({ message = 'Not Found', errorCode = ErrorCode.NOT_FOUND } = {}) {
    super({
      message,
      statusCode: StatusCode.NOT_FOUND,
      errorCode,
    })
  }
}

class ConflictError extends ErrorResponse {
  constructor({ message = 'Conflict', errorCode = ErrorCode.CONFLICT } = {}) {
    super({
      message,
      statusCode: StatusCode.CONFLICT,
      errorCode,
    })
  }
}

class ValidationError extends ErrorResponse {
  constructor({ message = 'Validation Error', errors = [] } = {}) {
    super({
      message,
      statusCode: StatusCode.UNPROCESSABLE_ENTITY,
      errorCode: ErrorCode.VALIDATION_ERROR,
      errors,
    })
  }
}

class InternalError extends ErrorResponse {
  constructor({ message = 'Internal Server Error' } = {}) {
    super({
      message,
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      errorCode: ErrorCode.INTERNAL_ERROR,
    })
  }
}

module.exports = {
  ErrorResponse,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  InternalError,
}
