'use strict'

const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      enum: ['active', 'completed', 'failed', 'pending'],
      default: 'pending',
    },
    products: {
      type: Array,
      required: true,
      default: [],
    },
    countProducts: {
      type: Number,
      default: 0,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'carts',
  },
)

cartSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const cart = mongoose.model('Cart', cartSchema)

module.exports = cart
