'use strict'

const { rabbitmq } = require('@shop/shared')
const logger = require('@configs/logger')
const NotificationService = require('@services/notification')
const { asyncConsumer } = require('@utils/asyncConsumer')

const QUEUE_NAME = 'notification-queue'

const processNotificationMessage = async (msgData) => {
  logger.info(`Consumer received message: ${msgData.event}`)

  const notiRecord = await NotificationService.recordNotification(msgData)
  logger.info(`Saved notification: ${notiRecord._id}`)

  // Virtual process send email
  logger.info('Process notification...')
  await new Promise(resolve => setTimeout(resolve, 2000))

  // TODO: update SUCCESS status
  // await NotificationService.updateNotificationStatus(notiRecord._id, 'SUCCESS')
  logger.info(`Updated notification status to [SUCCESS]`)
}

const listenToNotiQueue = async () => {
  await rabbitmq.consumeMessage(QUEUE_NAME, asyncConsumer(processNotificationMessage))
}

module.exports = {
  listenToNotiQueue
}