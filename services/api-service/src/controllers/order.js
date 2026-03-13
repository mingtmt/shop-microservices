'use strict'

const CheckoutService = require('@services/order')
const { OK } = require('@core/successResponse')

class CheckoutController {
  orderReview = async (req, res) => {
    const orderReview = await CheckoutService.orderReview({
      userId: req.user.id,
      cartId: req.body.cartId,
      products: req.body.products,
    })

    new OK({
      message: 'Checkout review success',
      data: orderReview,
    }).send(res)
  }
}

module.exports = new CheckoutController()
