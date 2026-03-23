'use strict'

const Notification = require('../models/notification')

class NotificationRepository {
  async createNotification(data) {
    try {
      return await Notification.create(data)
    } catch (error) {
      throw new Error(`Error Create Notification: ${error.message}`)
    }
  }
}

module.exports = new NotificationRepository()