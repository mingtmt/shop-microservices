'use strict'

const express = require('express')
const router = express.Router()
const asyncHandler = require('@utils/asyncHandler')
const cartController = require('@controllers/cart')
const { protect } = require('@middlewares/auth')

// guest

// user
router.use(protect)
router.post('/', asyncHandler(cartController.addToCart))
router.patch('/', asyncHandler(cartController.updateCart))
router.delete('/', asyncHandler(cartController.deleteCartItem))
router.get('/', asyncHandler(cartController.getListCartItems))

module.exports = router
