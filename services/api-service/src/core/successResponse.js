'use strict'

const { StatusCode } = require('./constants')

class SuccessResponse {
  constructor({ message = 'Success', statusCode = StatusCode.OK, data = null, metadata = null }) {
    this.success = true
    this.message = message
    this.data = data

    if (metadata && Object.keys(metadata).length > 0) {
      this.metadata = metadata
    }

    this.status = statusCode
  }

  send(res, headers = {}) {
    Object.keys(headers).forEach((key) => {
      res.setHeader(key, headers[key])
    })

    return res.status(this.status).json(this)
  }
}

class OK extends SuccessResponse {
  constructor({ message = 'Success', data = null, metadata = null } = {}) {
    super({
      message,
      statusCode: StatusCode.OK,
      data,
      metadata,
    })
  }
}

class Created extends SuccessResponse {
  constructor({ message = 'Resource created successfully', data = null, metadata = null } = {}) {
    super({
      message,
      statusCode: StatusCode.CREATED,
      data,
      metadata,
    })
  }
}

class NoContent extends SuccessResponse {
  constructor({ message = 'Resource deleted successfully' } = {}) {
    super({
      message,
      statusCode: StatusCode.NO_CONTENT,
    })
  }

  send(res) {
    return res.status(StatusCode.NO_CONTENT).send()
  }
}

module.exports = {
  SuccessResponse,
  OK,
  Created,
  NoContent,
}
