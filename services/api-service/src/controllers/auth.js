'use strict'

const AuthService = require('@services/auth')
const { OK, Created } = require('@core/successResponse')

class AuthController {
  register = async (req, res) => {
    const { newUser, tokens } = await AuthService.register(req.body)

    new Created({
      message: 'User registered successfully',
      data: {
        user: newUser,
        tokens,
      },
    }).send(res, {
      Location: `/api/users/${newUser.id}`,
    })
  }

  login = async (req, res) => {
    const { user, tokens } = await AuthService.login(req.body)

    new OK({
      message: 'Login successful',
      data: {
        user,
        tokens: tokens,
      },
    }).send(res)
  }

  refreshToken = async (req, res) => {
    const { refreshToken } = req.body
    const tokens = await AuthService.refreshToken(refreshToken)

    new OK({
      message: 'Token refreshed successfully',
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    }).send(res)
  }

  logout = async (req, res) => {
    await AuthService.logout(req.user.id)

    new OK({
      message: 'Logged out successfully',
      data: null,
    }).send(res)
  }

  getCurrentUser = async (req, res) => {
    const user = await AuthService.getCurrentUser(req.user.id)

    new OK({
      message: 'Get current user successfully',
      data: user,
    }).send(res)
  }
}

module.exports = new AuthController()
