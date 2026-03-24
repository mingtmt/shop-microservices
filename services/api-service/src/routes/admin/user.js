'use strict'

const express = require('express')
const router = express.Router()
const asyncHandler = require('@utils/asyncHandler')
const usersController = require('@controllers/user')

router.get('/', asyncHandler(usersController.getAllUsers))
router.patch('/:id/status', asyncHandler(usersController.updateUserStatus))
router.delete('/:id', asyncHandler(usersController.deleteUser))

module.exports = router
