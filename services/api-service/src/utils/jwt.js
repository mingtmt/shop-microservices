'use strict'

const jwt = require('jsonwebtoken')
const env = require('@configs/env')

class JWTHelper {
  static generateAccessToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '1d' })
  }

  static generateRefreshToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' })
  }

  static generateTokens(payload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    }
  }

  static verifyToken(token) {
    return jwt.verify(token, env.JWT_SECRET)
  }

  static decodeToken(token) {
    return jwt.decode(token)
  }
}

module.exports = JWTHelper
