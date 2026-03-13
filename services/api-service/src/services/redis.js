'use strict'

const redis = require('../configs/redis')

class Redis {
  static async acquireLock({ productId, cartId, quantity }) {
    const key = `lock_v2026_${productId}`
    const retryTimes = 10
    const expireTime = 3000

    for (let i = 0; i < retryTimes; i++) {
      const result = await redis.set(key, cartId, 'NX', 'PX', expireTime)

      if (result === 'OK') {
        // if lock acquired, return true
        return true
      } else {
        // if lock not acquired, wait for a while
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
    }

    return false
  }

  static async releaseLock(productId, cartId) {
    const key = `lock_v2026_${productId}`
    const valueParams = await redis.get(key)

    if (valueParams === cartId.toString()) {
      return await redis.del(key)
    }

    return 0
  }
}

module.exports = Redis
