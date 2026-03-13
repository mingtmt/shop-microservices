const Logger = require('@configs/logger')

const pushLogController = (req, res, next) => {
  try {
    const start = Date.now()

    res.on('finish', () => {
      const duration = Date.now() - start

      const method = req.method
      const url = req.originalUrl || req.url
      const status = res.statusCode
      const contentLength = res.get('content-length') || 0
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

      const message = `${method} ${url} ${status} ${duration}ms - ${contentLength}b`

      if (status >= 500) {
        Logger.error(message, {
          metadata: { ip, userAgent: req.headers['user-agent'] },
        })
      } else if (status >= 400) {
        Logger.warn(message)
      } else {
        Logger.info(message)
      }
    })

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = pushLogController
