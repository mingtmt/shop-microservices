'use strict'

const UserService = require('@services/user')
const { OK, NoContent } = require('@core/successResponse')

class UsersController {
  getAllUsers = async (req, res) => {
    const users = await UserService.getAllUsers(req.query)

    new OK({
      message: 'Get all users successfully',
      data: users,
      metadata: {
        limit: req.query.limit || 50,
        page: req.query.page || 1,
        total: users.length,
      },
    }).send(res)
  }

  getUserById = async (req, res) => {
    const user = await UserService.getUserById(req.user.id)

    new OK({
      message: 'Get user successfully',
      data: user,
    }).send(res)
  }

  updateUser = async (req, res) => {
    const updatedUser = await UserService.updateUser(req.user.id, req.body)

    new OK({
      message: 'User updated successfully',
      data: updatedUser,
    }).send(res)
  }

  updateUserStatus = async (req, res) => {
    console.log(req.body)
    const updatedUser = await UserService.updateUserStatus(req.params.id, req.body.isActive)

    new OK({
      message: 'User updated successfully',
      data: updatedUser,
    }).send(res)
  }

  deleteUser = async (req, res) => {
    await UserService.deleteUser(req.params.id)

    new NoContent({
      message: 'User deleted successfully',
    }).send(res)
  }
}

module.exports = new UsersController()
