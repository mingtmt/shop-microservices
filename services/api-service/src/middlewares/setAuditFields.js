'use strict'

const setAuditFields = (req, res, next) => {
  if (!req.user) {
    return next()
  }

  if (!req.body) {
    req.body = {}
  }

  const userId = req.user.id || req.user._id

  if (req.method === 'POST') {
    req.body.createdBy = userId
    req.body.updatedBy = userId
  }

  if (req.method === 'PATCH' || req.method === 'PUT') {
    req.body.updatedBy = userId
  }

  next()
}

module.exports = setAuditFields
