'use strict'

const user = require('@models/user')
const BaseRepository = require('./base')

class UserRepository extends BaseRepository {
  constructor() {
    super(user)
  }

  async findByEmail(email, select = '') {
    return await user.findOne({ email }).select(select)
  }
}

module.exports = new UserRepository()
