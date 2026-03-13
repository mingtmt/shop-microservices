'use strict'

const discount = require('@models/discount')
const BaseRepository = require('./base')

class DiscountRepository extends BaseRepository {
  constructor() {
    super(discount)
  }

  async findByCode(code, select = '') {
    return await discount.findOne({ code }).select(select)
  }
}

module.exports = new DiscountRepository()
