'use strict'

const mongoose = require('mongoose')
const { db: { uri, maxPoolSize } } = require('./configs')
const logger = require('./logger')

class Database {
  constructor() {
    this.connect()
  }

  async connect(type = 'mongodb') {
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }

    try {
      await mongoose.connect(uri, {
        maxPoolSize: maxPoolSize,
        serverSelectionTimeoutMS: 5000,
      })

      logger.info(`Connected Mongodb Success! State:`, mongoose.connection.readyState)
    } catch (err) {
      logger.error(`Error Connect to MongoDB: ${err.message}`)
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb
