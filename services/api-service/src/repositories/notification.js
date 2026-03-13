'use strict'

const notification = require('@models/notification')
const BaseRepository = require('./base')
const { getSelectData } = require('@utils')

class NotificationRepository extends BaseRepository {
  constructor() {
    super(notification)
  }

  findNotiByUserId({ userId, type, select }) {
    const match = { receiverId: userId }
    if (type !== 'ALL') {
      match.type = type
    }

    let projectStage = {}

    if (select) {
      const selectObj = getSelectData(select)

      projectStage = selectObj
    }

    return notification.aggregate([
      { $match: match },
      { $sort: { createdAt: -1 } },
      { $project: projectStage },
    ])
  }
}

module.exports = new NotificationRepository()
