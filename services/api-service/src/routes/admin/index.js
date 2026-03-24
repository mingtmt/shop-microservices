'use strict'

const express = require('express')
const router = express.Router()

const adminUserRouter = require('./user')
const adminProductRouter = require('./product')

router.use('/users', adminUserRouter)
router.use('/products', adminProductRouter)

module.exports = router
