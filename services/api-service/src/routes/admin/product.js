'use strict'

const express = require('express')
const router = express.Router()
const asyncHandler = require('@utils/asyncHandler')
const productController = require('@controllers/product')
const setAuditFields = require('@middlewares/setAuditFields')
const uploadImage = require('@middlewares/uploadImage')

router.get('/', asyncHandler(productController.getAllProductsForAdmin))
router.post(
  '/',
  uploadImage.single('thumbnail'),
  setAuditFields,
  asyncHandler(productController.createProduct),
)
router.patch('/:id', setAuditFields, asyncHandler(productController.updateProduct))
router.delete('/:id', asyncHandler(productController.deleteProduct))

module.exports = router
