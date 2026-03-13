'use strict'

require('dotenv').config()
require('module-alias/register')
const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerSpecs = require('@configs/swagger')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const routes = require('@routes')
const loggerMiddleware = require('@middlewares/logger')
const { errorHandler, notFoundHandler } = require('@middlewares/errorHandler')

const app = express()

// middlewares
app.use(express.json())
app.use(
  cors({
    origin: process.env.URL_CLIENT || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  }),
)
app.use(loggerMiddleware)
app.use(helmet())
app.use(compression())

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

// routes
app.use('/api/v1', routes)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app
