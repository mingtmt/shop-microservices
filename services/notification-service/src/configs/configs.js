'use strict'

const dev = {
  app: {
    port: process.env.PORT || 8001,
  },
  db: {
    uri: process.env.MONGODB_URI,
    maxPoolSize: 50,
  },
  rabbitmq: {
    uri: process.env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672',
  },
}

const prod = {
  app: {
    port: process.env.PORT || 8001,
  },
  db: {
    uri: process.env.MONGODB_URI,
    maxPoolSize: 10,
  },
  rabbitmq: {
    uri: process.env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672',
  },
}

const configs = {
  dev,
  prod,
}
const env = process.env.NODE_ENV || 'dev'

module.exports = configs[env]
