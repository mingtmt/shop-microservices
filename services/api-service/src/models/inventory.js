'use strict'

const mongoose = require('mongoose')

const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    location: {
      type: String,
      default: 'warehouse',
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Quantity invalid'],
    },
    reservations: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'inventories',
  },
)

const inventory = mongoose.model('Inventory', inventorySchema)

module.exports = inventory
