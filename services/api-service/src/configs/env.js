'use strict'

require('dotenv').config()

const PORT = process.env.PORT
const JWT_SECRET = process.env.JWT_SECRET
const GRAFANA_URL = process.env.GRAFANA_URL
const GRAFANA_ID = process.env.GRAFANA_ID
const GRAFANA_WRITE_TOKEN = process.env.GRAFANA_WRITE_TOKEN
const RABBITMQ_URI = process.env.RABBITMQ_URI

module.exports = {
  PORT,
  JWT_SECRET,
  GRAFANA_URL,
  GRAFANA_ID,
  GRAFANA_WRITE_TOKEN,
  RABBITMQ_URI,
}
