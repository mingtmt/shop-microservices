'use strict'

const logger = require('../configs/logger')

const asyncConsumer = (fn) => {
  return async (msgData) => {
    try {
      await fn(msgData)
    } catch (error) {
      logger.error(`[Consumer error] Event: ${msgData.event} - Detail: ${error.message}`)
      
      // TODO: send notification to admin
      
      // TODO: send message to dead letter
    }
  }
}

module.exports = { asyncConsumer }