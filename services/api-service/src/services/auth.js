'use strict'

const UserRepository = require('@repositories/user')
const { BadRequestError, ConflictError, UnauthorizedError } = require('@core/errorResponse')
const JWTHelper = require('@utils/jwt')

class AuthService {
  static async register(userData) {
    if (!userData || typeof userData !== 'object') {
      throw new BadRequestError({ message: 'Invalid user data' })
    }

    const { name, email, password, role } = userData

    if (!name || !email || !password) {
      throw new BadRequestError({ message: 'Name, email and password are required' })
    }

    const emailClean = email.toLowerCase().trim()
    const existingUser = await UserRepository.findByEmail(emailClean)
    if (existingUser) {
      throw new ConflictError({
        message: 'Email already exists',
        errorCode: 'EMAIL_DUPLICATE',
        metadata: {
          email: emailClean,
        },
      })
    }

    const newUser = await UserRepository.create({
      name: name.trim(),
      email: emailClean,
      password,
      role: role || 'user',
    })

    const tokens = JWTHelper.generateTokens({
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    })

    await UserRepository.updateById({
      userId: newUser._id,
      updateData: { refreshToken: tokens.refreshToken },
    })

    return {
      newUser,
      tokens,
    }
  }

  static async login({ email, password }) {
    if (!email || !password) {
      throw new BadRequestError({
        message: 'Email and password are required',
      })
    }

    const user = await UserRepository.findByEmail(email.toLowerCase(), '+password')

    if (!user) {
      throw new UnauthorizedError({
        message: 'Invalid email or password',
        errorCode: 'INVALID_CREDENTIALS',
      })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      throw new UnauthorizedError({
        message: 'Invalid email or password',
        errorCode: 'INVALID_CREDENTIALS',
      })
    }

    // TODO: check if user is active
    // if (user.status !== 'active') {
    //   throw new UnauthorizedError({
    //     message: 'Account is not active',
    //     errorCode: 'ACCOUNT_INACTIVE',
    //   })
    // }

    const tokens = JWTHelper.generateTokens({
      id: user._id,
      email: user.email,
      role: user.role,
    })

    await UserRepository.updateById({
      userId: user._id,
      updateData: { refreshToken: tokens.refreshToken },
    })

    return {
      user,
      tokens,
    }
  }

  static async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new BadRequestError({ message: 'Refresh token is required' })
    }

    let decoded
    try {
      decoded = JWTHelper.verifyToken(refreshToken)
    } catch (error) {
      throw new UnauthorizedError({
        message: 'Invalid or expired refresh token',
        errorCode: 'INVALID_REFRESH_TOKEN',
      })
    }

    const user = await UserRepository.findById(decoded.id, '+refreshToken')

    if (!user) {
      throw new UnauthorizedError({
        message: 'User not found',
        errorCode: 'USER_NOT_FOUND',
      })
    }

    if (user.refreshToken !== refreshToken) {
      throw new UnauthorizedError({
        message: 'Invalid refresh token',
        errorCode: 'INVALID_REFRESH_TOKEN',
      })
    }

    const tokens = JWTHelper.generateTokens({
      id: user._id,
      email: user.email,
      role: user.role,
    })

    await UserRepository.updateById({
      userId: user._id,
      updateData: { refreshToken: tokens.refreshToken },
    })

    return tokens
  }

  static async logout(userId) {
    const user = await UserRepository.findById(userId)

    if (!user) {
      throw new UnauthorizedError({ message: 'User not found' })
    }

    await UserRepository.updateById({
      userId: user._id,
      updateData: { refreshToken: undefined },
    })

    return { message: 'Logged out successfully' }
  }

  static async getCurrentUser(userId) {
    const user = await UserRepository.findById(userId)

    if (!user) {
      throw new UnauthorizedError({ message: 'User not found' })
    }

    return user
  }
}

module.exports = AuthService
