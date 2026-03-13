'use strict'

const CommentService = require('@services/comment')
const { Created, OK, NoContent } = require('@core/successResponse')

class CommentController {
  createComment = async (req, res) => {
    const comment = await CommentService.createComment({ userId: req.user.id, ...req.body })

    return new Created({
      message: 'Comment created successfully',
      data: comment,
    }).send(res)
  }

  getCommentsByParentId = async (req, res) => {
    const comments = await CommentService.getCommentsByParentId(req.query)

    return new OK({
      message: 'Get comments successfully',
      data: comments,
    }).send(res)
  }

  deleteComments = async (req, res) => {
    await CommentService.deleteComments(req.body)

    return new NoContent({
      message: 'Comment deleted successfully',
    }).send(res)
  }
}

module.exports = new CommentController()
