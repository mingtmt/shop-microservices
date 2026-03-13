'use strict'

const JWTHelper = require('@utils/jwt')
const UserRepository = require('@repositories/user')
const { UnauthorizedError, ForbiddenError } = require('@core/errorResponse')

const protect = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      throw new UnauthorizedError({
        message: 'You are not logged in. Please login to access this resource',
        errorCode: 'NOT_AUTHENTICATED',
      })
    }

    let decoded
    try {
      decoded = JWTHelper.verifyToken(token)
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedError({
          message: 'Your token has expired. Please login again',
          errorCode: 'TOKEN_EXPIRED',
        })
      }
      throw new UnauthorizedError({
        message: 'Invalid token. Please login again',
        errorCode: 'INVALID_TOKEN',
      })
    }

    // Check if user still exists
    const user = await UserRepository.findById(decoded.id, '+passwordChangeAt')

    if (!user) {
      throw new UnauthorizedError({
        message: 'The user belonging to this token no longer exists',
        errorCode: 'USER_NOT_FOUND',
      })
    }

    // TODO: check if user is active
    // if (user.status !== 'active') {
    //   throw new UnauthorizedError({
    //     message: 'Your account is not active',
    //     errorCode: 'ACCOUNT_INACTIVE',
    //   })
    // }

    // Check if password changed after token issued
    if (user.changedPasswordAfter(decoded.iat)) {
      throw new UnauthorizedError({
        message: 'Password recently changed. Please login again',
        errorCode: 'PASSWORD_CHANGED',
      })
    }

    // Grant access to protected route
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError({
        message: 'You do not have permission to perform this action',
        errorCode: 'INSUFFICIENT_PERMISSIONS',
      })
    }
    next()
  }
}

module.exports = {
  protect,
  restrictTo,
}
