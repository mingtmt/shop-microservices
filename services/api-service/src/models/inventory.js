'use strict'

const mongoose = require('mongoose')

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

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
    collection: COLLECTION_NAME,
  },
)

const inventory = mongoose.model(DOCUMENT_NAME, inventorySchema)

module.exports = inventory
