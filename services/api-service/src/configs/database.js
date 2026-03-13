'use strict'

require('dotenv').config()
const mongoose = require('mongoose')
const env = require('./env')
const { countConnect } = require('@helpers/checkConnect')

const connectionString =
  process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI

class Database {
  constructor() {
    this.connect()
  }

  async connect(type = 'mongodb') {
    if (env.NODE_ENV === 'development') {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }

    try {
      await mongoose.connect(connectionString, {
        maxPoolSize: 50,
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
