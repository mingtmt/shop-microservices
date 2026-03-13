'use strict'

const mongoose = require('mongoose')

const getSelectData = (select) => {
  if (!select) return null

  const selectArray = typeof select === 'string' ? select.split(' ') : select

  return Object.fromEntries(selectArray.filter(String).map((el) => [el, 1]))
}

const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 0]))
}

const removeUndefined = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null) delete obj[key]
  })

  return obj
}

const updateNestedObjectParser = (obj) => {
  const final = {}
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const nestedObj = updateNestedObjectParser(obj[key])
      Object.keys(nestedObj).forEach((nestedKey) => {
        final[`${key}.${nestedKey}`] = nestedObj[nestedKey]
      })
    } else {
      final[key] = obj[key]
    }
  })

  return final
}

const convertToMongoObjectId = (id) => {
  return new mongoose.Types.ObjectId(id)
}

module.exports = {
  getSelectData,
  getUnSelectData,
  removeUndefined,
  updateNestedObjectParser,
  convertToMongoObjectId,
}
