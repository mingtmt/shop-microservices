'use strict'

const mongoose = require('mongoose')

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['ORDER_SUCCESS', 'ORDER_FAILED', 'PROMOTION', 'PRODUCT_PUBLISHED'],
      required: true,
    },
    receivedId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      default: {},
    },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)

const Notification = mongoose.model(DOCUMENT_NAME, notificationSchema)

module.exports = Notification
