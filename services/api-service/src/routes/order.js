'use strict'

const express = require('express')
const router = express.Router()
const asyncHandler = require('@utils/asyncHandler')
const checkoutController = require('@controllers/order')
const { protect } = require('@middlewares/auth')

// user
router.use(protect)
router.post('/review', asyncHandler(checkoutController.checkoutReview))

module.exports = router
