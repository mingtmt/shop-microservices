'use strict'

const DiscountService = require('@services/discount')
const { OK } = require('@core/successResponse')

class DiscountController {
  getAllDiscountCode = async (req, res) => {
    const discountCodes = await DiscountService.getAllDiscountCode(req.query)

    new OK({
      message: 'Get all discount codes successfully',
      data: discountCodes,
      metadata: {
        limit: req.query.limit || 50,
        page: req.query.page || 1,
        total: discountCodes.length,
      },
    }).send(res)
  }

  getAllProductsByDiscountCode = async (req, res) => {
    const products = await DiscountService.getAllProductsByDiscountCode(req.params.code)

    new OK({
      message: 'Get all products by discount code successfully',
      data: products,
      metadata: {
        total: products.length,
      },
    }).send(res)
  }

  createDiscountCode = async (req, res) => {
    const discountCode = await DiscountService.createDiscountCode(req.body)

    new OK({
      message: 'Create discount code successfully',
      data: discountCode,
    }).send(res)
  }
}

module.exports = new DiscountController()
