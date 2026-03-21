'use strict'

require('dotenv').config()
require('./src/configs/database')
const { rabbitmq } = require('@shop/shared')
const Notification = require('./src/models/notification')
const logger = require('./src/configs/logger')

const QUEUE_NAME = 'notification-queue'

const runConsumer = async () => {
  try {
    const rabbitMQUrl = process.env.RABBITMQ_URI
    await rabbitmq.connectRabbitMQ(rabbitMQUrl)
    logger.info('[Notification Service] Connected to RabbitMQ successfully')

    await rabbitmq.consumeMessage(QUEUE_NAME, async (msgData) => {
      logger.info(`[New Message] event: ${msgData.event}`)
      
      switch (msgData.event) {
        case 'PRODUCT_PUBLISHED':
            // TODO: Handle the PRODUCT_PUBLISHED event
            console.log(`>> Sending noti for new product: ${msgData.data.productName}`)
            
            // Simulate sending notification
            await new Promise(resolve => setTimeout(resolve, 2000))
            console.log(`>> Sended noti successfully for product ${msgData.data.productId}!`)
            break;
            
        case 'ORDER_SUCCESS':
            break;

        default:
            console.log('>> Event not supported.')
            break;
      }
    })

  } catch (error) {
    logger.error('Error in Notification Consumer:', error)
    process.exit(1)
  }
}

runConsumer()