'use strict'

const inventory = require('@models/inventory')
const BaseRepository = require('./base')

class InventoryRepository extends BaseRepository {
  constructor() {
    super(inventory)
  }

  async insertInventory({ productId, location = 'warehouse', stock = 0 }) {
    return await inventory.create({
      productId,
      location,
      stock,
    })
  }

  async addStockToInventory({ productId, location = 'warehouse', stock = 0 }) {
    const query = { productId }
    const update = { $inc: { stock }, $set: { location } }
    const options = { upsert: true, new: true }

    return await inventory.findOneAndUpdate(query, update, options)
  }

  async reservationInventory({ productId, cartId, quantity }) {
    const query = {
      productId,
      stock: { $gte: quantity }, // check if stock is enough
    }

    const update = {
      $inc: { stock: -quantity }, // decrement stock
      $push: {
        reservations: {
          quantity,
          cartId,
          createOn: new Date(),
        },
      },
    }

    const options = { new: true, upsert: true }

    return await inventory.findOneAndUpdate(query, update, options)
  }
}

module.exports = new InventoryRepository()
