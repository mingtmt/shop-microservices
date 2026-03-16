'use strict'

const moduleAlias = require('module-alias')
const path = require('path')

moduleAlias.addAliases({
  '@configs': path.join(__dirname, 'src/configs'),
  '@controllers': path.join(__dirname, 'src/controllers'),
  '@core': path.join(__dirname, 'src/core'),
  '@helpers': path.join(__dirname, 'src/helpers'),
  '@middlewares': path.join(__dirname, 'src/middlewares'),
  '@models': path.join(__dirname, 'src/models'),
  '@repositories': path.join(__dirname, 'src/repositories'),
  '@routes': path.join(__dirname, 'src/routes'),
  '@services': path.join(__dirname, 'src/services'),
  '@utils': path.join(__dirname, 'src/utils'),
})

const mongoose = require('mongoose')
const app = require('./src/app')
const env = require('./src/configs/env')
const logger = require('./src/configs/logger')
const db = require('./src/configs/database')
require('./src/configs/redis')
const { checkOverload } = require('./src/helpers/checkConnect')
const { rabbitmq } = require('@shop/shared')

let server

const startServer = async () => {
  try {
    await db.connect()
    checkOverload()

    await rabbitmq.connectRabbitMQ(process.env.RABBITMQ_URI)

    server = app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

const exitHandler = async () => {
  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve))
      logger.info('Server Express closed')
    }

    await mongoose.connection.close(false)
    logger.info('Mongoose connection closed')

    process.exit(0)
  } catch (err) {
    logger.error('Error closing server:', err)
    process.exit(1)
  }
}

process.on('SIGINT', () => {
  logger.info('System interrupt signal detected. Exiting...')
  exitHandler()
})

process.on('SIGTERM', () => {
  logger.info('System termination signal detected. Exiting...')
  exitHandler()
})

process.once('SIGUSR2', () => {
  mongoose.connection.close(() => {
    logger.info('Mongoose disconnected through nodemon restart')
    process.kill(process.pid, 'SIGUSR2')
  })
})

startServer()
