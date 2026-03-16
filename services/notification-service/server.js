'use strict'

require('dotenv').config()
const { rabbitmq } = require('@shop/shared')
const db = require('./src/configs/database')
const Notification = require('./src/models/notification.model')

const QUEUE_NAME = 'notification-queue'

const runConsumer = async () => {
  try {
    await db.connect()
    const rabbitMQUrl = process.env.RABBITMQ_URI
    await rabbitmq.connectRabbitMQ(rabbitMQUrl)
    console.log('[Notification Service] Connected to RabbitMQ successfully')

    await rabbitmq.consumeMessage(QUEUE_NAME, async (msgData) => {
      console.log('----------------------------------------')
      console.log(`[New Message] event: ${msgData.event}`)
      console.log('Data:', msgData.data)
      
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
      console.log('----------------------------------------')
    })

  } catch (error) {
    console.error('Error in Notification Consumer:', error)
    process.exit(1)
  }
}

runConsumer()