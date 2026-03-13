'use strict'

const winston = require('winston')
const LokiTransport = require('winston-loki')
const { GRAFANA_URL, GRAFANA_ID, GRAFANA_WRITE_TOKEN } = require('./env')
const { combine, timestamp, json, printf, colorize } = winston.format

const devFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`
})

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    json(),
  ),
  defaultMeta: { service: 'nodejs-backend' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),

    // winston-loki transport logs to Grafana Loki
    new LokiTransport({
      host: GRAFANA_URL,
      basicAuth: `${GRAFANA_ID}:${GRAFANA_WRITE_TOKEN}`,
      labels: { app: 'shop-service' },
      json: true,
      batching: true,
      interval: 5,
      batchSize: 10,
    }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), devFormat),
    }),
  )
}

module.exports = logger
