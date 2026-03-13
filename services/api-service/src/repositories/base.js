'use strict'

class BaseRepository {
  constructor(model) {
    this.model = model
  }

  async findAll({ filter = {}, limit = 50, page = 1, sort = 'createdAt', select = '' }) {
    const skip = (Number(page) - 1) * Number(limit)
    const sortBy = sort === 'ctime' ? '_id' : sort

    return await this.model
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit))
      .select(select)
      .lean()
      .exec()
  }

  async findById(id, select = '') {
    return await this.model.findById(id).select(select)
  }

  async create(payload) {
    return await this.model.create(payload)
  }

  async updateById({ id, payload, isNew = true }) {
    return await this.model.findByIdAndUpdate(id, payload, {
      new: isNew,
      runValidators: true,
    })
  }

  async deleteById(id) {
    return await this.model.findByIdAndDelete(id)
  }
}

module.exports = BaseRepository
