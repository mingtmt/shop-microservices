'use strict'

const { rabbitmq } = require('@shop/shared')
const logger = require('../configs/logger')
const NotificationService = require('../services/notification')

const QUEUE_NAME = 'notification-queue'

const listenToNotiQueue = async () => {
  try {
    await rabbitmq.consumeMessage(QUEUE_NAME, async (msgData) => {
      logger.info(`Consumer received message: ${msgData.event}`)
      let notiRecord = null

      try {
        notiRecord = await NotificationService.recordNotification(msgData)
        logger.info(`Saved notification: ${notiRecord._id}`)

        // Virtual process send email
        logger.info('Process notification...')
        await new Promise(resolve => setTimeout(resolve, 2000))

        // TODO: update SUCCESS status
        // await NotificationService.updateNotificationStatus(notiRecord._id, 'SUCCESS')
        logger.info(`Updated notification status to [SUCCESS]`)

      } catch (processError) {
        logger.error(`Error process notification: ${processError.message}`)
        
        // TODO: update FAILED status
        if (notiRecord) {
          // await NotificationService.updateNotificationStatus(notiRecord._id, 'FAILED')
          logger.warn(`Updated notification status to [FAILED]`)
        }
      }
    })
  } catch (error) {
    logger.error(`Consumer error: ${error.message}`)
    throw error
  }
}

module.exports = {
  listenToNotiQueue
}