'use strict'

const mongoose = require('mongoose')

// ORDER-001: order successfully
// ORDER-002: order failed
// PROMOTION-001: new promotion
// SHOP-001: new product

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enums: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],
      required: true,
    },
    senderId: {
      type: Number,
      required: true,
    },
    receiverId: {
      type: Number,
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
  },
  {
    timestamps: true,
    collection: 'notifications',
  },
)

const notification = mongoose.model('Notification', notificationSchema)

module.exports = notification
