'use strict'

const express = require('express')
const router = express.Router()
const asyncHandler = require('@utils/asyncHandler')
const productController = require('@controllers/product')
const { protect } = require('@middlewares/auth')

// guest
router.get('/', asyncHandler(productController.getAllProducts))
router.get('/:slug', asyncHandler(productController.getProductBySlug))
router.get('/search/:keySearch', asyncHandler(productController.searchProducts))

//user
router.use(protect)

module.exports = router
