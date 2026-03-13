'use strict'

const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    checkout: {
      type: Object,
      default: {},
    },
    shipping: {
      type: Object,
      default: {},
    },
    payment: {
      type: Object,
      default: {},
    },
    products: {
      type: Array,
      required: true,
    },
    trackingNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    collection: 'orders',
  },
)

orderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const order = mongoose.model('Order', orderSchema)

module.exports = order
