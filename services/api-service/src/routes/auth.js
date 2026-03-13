'use strict'

const express = require('express')
const router = express.Router()
const asyncHandler = require('@utils/asyncHandler')
const authController = require('@controllers/auth')
const { protect } = require('@middlewares/auth')

// guest
router.post('/register', asyncHandler(authController.register))
router.post('/login', asyncHandler(authController.login))
router.post('/refresh-token', asyncHandler(authController.refreshToken))

// user, admin
router.post('/logout', protect, asyncHandler(authController.logout))
router.get('/me', protect, asyncHandler(authController.getCurrentUser))

module.exports = router
