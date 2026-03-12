'use strict'

const NotificationService = require('@services/notification')
const { OK } = require('@core/successResponse')

class NotificationController {
  getNotiByUser = async (req, res) => {
    const notifications = await NotificationService.getNotiByUserId(req.user.id, req.query.type)

    new OK({
      message: 'Get notifications successfully',
      data: notifications,
      metadata: {
        total: notifications.length,
      },
    }).send(res)
  }
}

module.exports = new NotificationController()
