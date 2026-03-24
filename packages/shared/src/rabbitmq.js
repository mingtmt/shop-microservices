'use strict'

const amqplib = require('amqplib')

let connection = null
let channel = null

const connectRabbitMQ = async (url) => {
  if (connection && channel) return { connection, channel }

  try {
    connection = await amqplib.connect(url)
    channel = await connection.createChannel()
    console.log('[Shared] Connected to RabbitMQ successfully')
    return { connection, channel }
  } catch (error) {
    console.error('RabbitMQ Connection Error:', error)
    throw error
  }
}

const publishMessage = async (queueName, message) => {
  try {
    if (!channel)
      throw new Error('RabbitMQ Channel is not initialized. Please call connectRabbitMQ first.')

    await channel.assertQueue(queueName, { durable: true })

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    })
    console.log(`[Shared] Message sent to queue: ${queueName}`)
  } catch (error) {
    console.error('Publish Error:', error)
    throw error
  }
}

const consumeMessage = async (queueName, callback) => {
  try {
    if (!channel) throw new Error('RabbitMQ Channel is not initialized.')

    await channel.assertQueue(queueName, { durable: true })
    console.log(`[Shared] Waiting for messages in queue: ${queueName}`)

    channel.consume(
      queueName,
      (msg) => {
        if (msg !== null) {
          const data = JSON.parse(msg.content.toString())
          callback(data)
          channel.ack(msg)
        }
      },
      { noAck: false },
    )
  } catch (error) {
    console.error('Consume Error:', error)
    throw error
  }
}

module.exports = {
  connectRabbitMQ,
  publishMessage,
  consumeMessage,
}
