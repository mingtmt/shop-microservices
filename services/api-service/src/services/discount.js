'use strict'

const DiscountRepository = require('@repositories/discount')
const ProductRepository = require('@repositories/product')
const { BadRequestError, NotFoundError, ConflictError } = require('@core/errorResponse')

class DiscountService {
  static async getAllDiscountCode(query) {
    const { page, limit, sort, ...filter } = query
    return await DiscountRepository.findAll({
      filter,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 50,
      sort: sort || 'createdAt',
      select: '-__v',
    })
  }

  static async getAllProductsByDiscountCode(code) {
    const foundDiscount = await DiscountRepository.findByCode(code)
    if (!foundDiscount && !foundDiscount.isActive) {
      throw new NotFoundError({ message: 'Discount code not found' })
    }

    const { applyTo, productIds } = foundDiscount
    let products
    if (applyTo === 'all') {
      products = await ProductRepository.findAll({
        filter: {
          isDraft: false,
          isPublished: true,
        },
        select: 'name',
      })
    } else if (applyTo === 'specific') {
      products = await ProductRepository.findAll({
        filter: {
          isDraft: false,
          isPublished: true,
          _id: { $in: productIds },
        },
        select: 'name',
      })
    }

    return products
  }

  static async createDiscountCode(payload) {
    const { code, startDate, endDate, minOrderValue, applyTo, productIds } = payload
    const foundDiscount = await DiscountRepository.findByCode(code)
    if (foundDiscount && foundDiscount.isActive) {
      throw new ConflictError({ message: 'Discount code already exists' })
    }

    if (new Date(startDate) > new Date(endDate)) {
      throw new BadRequestError({ message: 'Start date should be before end date' })
    }

    if (new Date() > new Date(startDate) || new Date() < new Date(endDate)) {
      throw new BadRequestError({ message: 'Invalid start date or end date' })
    }

    const newDiscount = await DiscountRepository.create({
      ...payload,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      minOrderValue: minOrderValue || 0,
      productIds: applyTo === 'all' ? [] : productIds,
    })

    return newDiscount
  }
}

module.exports = DiscountService
