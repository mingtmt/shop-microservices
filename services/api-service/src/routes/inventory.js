'use strict'

const express = require('express')
const router = express.Router()
const asyncHandler = require('@utils/asyncHandler')
const inventoryController = require('@controllers/inventory')
const { protect, restrictTo } = require('@middlewares/auth')

// admin
router.use(protect)
router.use(restrictTo('admin'))
router.post('/add-stock', asyncHandler(inventoryController.addStockToInventory))

module.exports = router
