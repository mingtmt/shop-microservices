'use strict'

const express = require('express')
const router = express.Router()

const adminProductRouter = require('./product')

router.use('/products', adminProductRouter)

module.exports = router
