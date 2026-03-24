'use strict'

const NotificationRepository = require('@repositories/notification')

class NotificationService {
  static async recordNotification(msgData) {
    let notiData = {}

    switch (msgData.event) {
      case 'PRODUCT_PUBLISHED':
        notiData = {
          type: 'PRODUCT_PUBLISHED',
          receivedId: 'ALL',
          content: `Sản phẩm mới: ${msgData.data.productName} vừa lên kệ!`,
          options: msgData.data,
          status: 'PENDING',
        }
        break

      case 'ORDER_SUCCESS':
        notiData = {
          type: 'ORDER_SUCCESS',
          receivedId: msgData.data.userId,
          content: `Đơn hàng #${msgData.data.orderId} đã được đặt thành công.`,
          options: msgData.data,
          status: 'PENDING',
        }
        break

      default:
        throw new Error(`Unknown Event: ${msgData.event}`)
    }

    return await NotificationRepository.createNotification(notiData)
  }
}

module.exports = NotificationService
