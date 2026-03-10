'use strict'

const UserRepository = require('@repositories/user')
const { BadRequestError, NotFoundError } = require('@core/errorResponse')

class UserService {
  static async getAllUsers(query) {
    const { page, limit, sort, ...filter } = query
    return await UserRepository.findAll({
      filter,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 50,
      sort: sort || 'createdAt',
      select: '-password -__v -refreshToken',
    })
  }

  static async getUserById(id) {
    const user = await UserRepository.findById(id)

    if (!user) {
      throw new NotFoundError({ message: 'User not found' })
    }

    return user
  }

  static async updateUser(id, updateData) {
    if (!updateData || typeof updateData !== 'object') {
      throw new BadRequestError({ message: 'Invalid update data' })
    }

    if (updateData.password) {
      throw new BadRequestError({ message: 'Use changePassword method to update password' })
    }

    const user = await UserRepository.updateById({
      id,
      payload: updateData,
    })

    if (!user) throw new NotFoundError({ message: 'User not found' })

    return user
  }

  static async updateUserStatus(id, isActive) {
    const user = await UserRepository.updateById({
      id,
      payload: { isActive },
    })

    if (!user) throw new NotFoundError({ message: 'User not found' })

    return user
  }

  static async deleteUser(id) {
    const user = await UserRepository.deleteById(id)

    if (!user) throw new NotFoundError({ message: 'User not found' })

    return { message: 'User deleted successfully' }
  }
}

module.exports = UserService
