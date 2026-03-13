'use strict'

const express = require('express')
const router = express.Router()
const asyncHandler = require('@utils/asyncHandler')
const { protect, restrictTo } = require('@middlewares/auth')
const discountController = require('@controllers/discount')

// guest
router.get('/discount-code', asyncHandler(discountController.getAllDiscountCode))

// user
router.use(protect)

// admin
router.use(restrictTo('admin'))
router.post('/discount-code', asyncHandler(discountController.createDiscountCode))
