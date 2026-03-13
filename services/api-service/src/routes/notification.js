'use strict'

const express = require('express')
const router = express.Router()
const asyncHandler = require('@utils/asyncHandler')
const { protect } = require('@middlewares/auth')
const notificationController = require('@controllers/notification')

// user
router.use(protect)
router.get('/', asyncHandler(notificationController.getNotiByUser))

module.exports = router
