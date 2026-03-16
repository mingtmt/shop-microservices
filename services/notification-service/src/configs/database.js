'use strict'

const mongoose = require('mongoose')
const { db: { uri, maxPoolSize } } = require('./configs/configs')
const { countConnect } = require('@helpers/checkConnect')

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

      console.log(`Connected Mongodb Success! State:`, mongoose.connection.readyState)

      countConnect()
    } catch (err) {
      console.error(`Error Connect to MongoDB: ${err.message}`)
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
