'use strict'

require('dotenv').config()
const moduleAlias = require('module-alias')
const path = require('path')

moduleAlias.addAliases({
  '@configs': path.join(__dirname, 'src/configs'),
  '@consumers': path.join(__dirname, 'src/consumers'),
  '@models': path.join(__dirname, 'src/models'),
  '@repositories': path.join(__dirname, 'src/repositories'),
  '@services': path.join(__dirname, 'src/services'),
  '@utils': path.join(__dirname, 'src/utils'),
})

const { rabbitmq } = require('@shop/shared')
const logger = require('@configs/logger')
require('@configs/database')

const { listenToNotiQueue } = require('@consumers/notification')

const startService = async () => {
  try {
    // Connect to RabbitMQ
    await rabbitmq.connectRabbitMQ(process.env.RABBITMQ_URI)
    logger.info('[Notification Service] Connected RabbitMQ')

    // Listen to Notification Queue
    await listenToNotiQueue()
  } catch (error) {
    logger.error(`Fatal Error: ${error.message}`)
    process.exit(1)
  }
}

startService()
