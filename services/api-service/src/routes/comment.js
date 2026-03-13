'use strict'

const express = require('express')
const router = express.Router()
const asyncHandler = require('@utils/asyncHandler')
const commentController = require('@controllers/comment')
const { protect } = require('@middlewares/auth')

// user
router.use(protect)
router.post('/', asyncHandler(commentController.createComment))
router.get('/', asyncHandler(commentController.getCommentsByParentId))
router.delete('/', asyncHandler(commentController.deleteComments))

module.exports = router
