'use strict'

const logger = require('@configs/logger')
const { StatusCode, ErrorCode } = require('@core/constants')
const { NotFoundError } = require('@core/errorResponse')
const { removeImageByPublicId } = require('@utils/cloudinary')

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || StatusCode.INTERNAL_SERVER_ERROR
  const errorCode = error.errorCode || ErrorCode.INTERNAL_ERROR
  const message = error.message || 'Internal Server Error'

  const logData = {
    statusCode,
    errorCode,
    message,
    url: req.url,
    method: req.method,
  }

  if (statusCode >= 500) {
    logger.error('Critical Error:', {
      ...logData,
      stack: error.stack,
      body: req.body,
      params: req.params,
      query: req.query,
    })
  } else {
    logger.warn('Client Error:', logData)
  }

  const response = {
    success: false,
    error: {
      statusCode,
      code: errorCode,
      message,
    },
  }

  if (error.errors) {
    response.error.errors = error.errors
  }

  if (process.env.NODE_ENV === 'development') {
    response.error.stack = error.stack
    response.error.raw = error
  }

  if (!req.fileProcessed) {
    const filesToClean = []

    if (req.file) {
      filesToClean.push(req.file)
    }

    if (req.files) {
      const arrayFiles = Array.isArray(req.files) ? req.files : Object.values(req.files).flat()
      filesToClean.push(...arrayFiles)
    }

    if (filesToClean.length > 0) {
      Promise.allSettled(
        filesToClean.map((file) => {
          const publicId = file.filename || file.public_id
          return removeImageByPublicId(publicId)
        }),
      ).then((results) => {
        logger.info('Cleanup results:', results)
      })
    }
  }

  res.status(statusCode).json(response)
}

const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`))
}

module.exports = {
  errorHandler,
  notFoundHandler,
}
