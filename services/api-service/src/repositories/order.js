'use strict'

const order = require('@models/order')
const BaseRepository = require('./base')

class OrderRepository extends BaseRepository {
  constructor() {
    super(order)
  }
}

module.exports = new OrderRepository()
