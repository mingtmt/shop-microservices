'use strict'

require('dotenv').config()
const { rabbitmq } = require('@shop/shared')
const logger = require('./src/configs/logger')
require('./src/configs/database') 

const { listenToNotiQueue } = require('./src/consumers/notification')

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