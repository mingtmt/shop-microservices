'use strict'

require('dotenv').config()
const Redis = require('ioredis')

const redisConfig = {
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || 'localhost',
  // username: process.env.REDIS_USERNAME,
  // password: process.env.REDIS_PASSWORD,
  db: 0,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
}

const redis = new Redis(redisConfig)

redis.on('connect', () => {
  console.log('Redis connected successfully')
})

redis.on('error', (error) => {
  console.error('Redis connection error:', error)
})

module.exports = redis
