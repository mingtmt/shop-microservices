'use strict'

const CommentRepository = require('@repositories/comment')
const { NotFoundError } = require('@core/errorResponse')

class CommentService {
  static async createComment(payload) {
    let right = 0
    if (payload.parentId) {
      const parent = await CommentRepository.findById(payload.parentId)
      if (!parent) {
        throw new NotFoundError({ message: 'Parent comment not found' })
      }

      right = parent.right

      await CommentRepository.updateMany(
        {
          productId: payload.productId,
          right: { $gte: right },
        },
        { $inc: { right: 2 } },
      )

      await CommentRepository.updateMany(
        {
          productId: payload.productId,
          left: { $gt: right },
        },
        { $inc: { left: 2 } },
      )
    } else {
      const maxRight = await CommentRepository.maxRightValue(payload.productId)
      if (maxRight) {
        right = maxRight.right + 1
      } else {
        right = 1
      }
    }

    return await CommentRepository.create({
      ...payload,
      left: right,
      right: right + 1,
    })
  }

  static async getCommentsByParentId(query) {
    const { productId, parentId } = query

    if (parentId) {
      const parent = await CommentRepository.findById(parentId)
      if (!parent) {
        throw new NotFoundError({ message: 'Parent comment not found' })
      }

      const comments = await CommentRepository.findAll({
        filter: {
          productId,
          left: { $gt: parent.left },
          right: { $lte: parent.right },
        },
        sort: 'left',
        select: '-_id, -__v',
      })

      return comments
    }

    const comments = await CommentRepository.findAll({
      filter: {
        productId,
        parentId: null,
      },
      sort: 'left',
      select: '-_id, -__v',
    })

    return comments
  }

  static async deleteComments(query) {
    const { productId, commentId } = query

    const comment = await CommentRepository.findById(commentId)
    if (!comment) {
      throw new NotFoundError({ message: 'Comment not found' })
    }

    const leftValue = comment.left
    const rightValue = comment.right

    const width = rightValue - leftValue + 1

    await CommentRepository.deleteMany({
      productId,
      left: { $gte: leftValue },
      right: { $lte: rightValue },
    })

    // update other comments
    await CommentRepository.updateMany(
      {
        productId,
        right: { $gt: rightValue },
      },
      { $inc: { right: -width } },
    )

    await CommentRepository.updateMany(
      {
        productId,
        left: { $gt: leftValue },
      },
      { $inc: { left: -width } },
    )
  }
}

module.exports = CommentService
