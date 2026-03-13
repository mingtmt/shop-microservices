'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const logger = require('@configs/logger')

const _SECOND = 5000

const countConnect = () => {
  const numConnections = mongoose.connections.length
  console.log(`Number of connections: ${numConnections}`)
}

const checkOverload = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss

    // For example, maximum 5 connections per core
    const maxConnections = numCores * 5
    // For example, maximum 500 MB memory usage
    const memoryLimit = 500 * 1024 * 1024

    if (numConnections > maxConnections) {
      logger.error({
        label: 'OVERLOAD_CONNECTION',
        message: `Alert connection overload!`,
        details: {
          current: numConnections,
          limit: maxConnections,
          cpuCores: numCores,
        },
      })
    }

    if (memoryUsage > memoryLimit) {
      logger.warn({
        label: 'HIGH_MEMORY_USAGE',
        message: `Alert high memory usage!`,
        details: {
          memoryUsed: `${(memoryUsage / 1024 / 1024).toFixed(2)} MB`,
          limit: '500 MB',
        },
      })
    }
  }, _SECOND)
}

module.exports = {
  countConnect,
  checkOverload,
}
