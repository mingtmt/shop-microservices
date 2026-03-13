'use strict'

const CartService = require('@services/cart')
const { OK, NoContent } = require('@core/successResponse')

class CartController {
  addToCart = async (req, res) => {
    const newCart = await CartService.addToCart(req.user.id, req.body)

    new OK({
      message: 'Create new Cart success',
      data: newCart,
    }).send(res)
  }

  updateCart = async (req, res) => {
    const updatedCart = await CartService.updateCartQuantity(req.user.id, req.body)

    new OK({
      message: 'Cart updated successfully',
      data: updatedCart,
    }).send(res)
  }

  deleteCartItem = async (req, res) => {
    await CartService.deleteCartItems(req.user.id, req.body.productIds)

    new NoContent({
      message: 'Delete Cart success',
    }).send(res)
  }

  getListCartItems = async (req, res) => {
    const cart = await CartService.getListCartItems(req.user.id)

    new OK({
      message: 'Get list Cart success',
      data: cart,
    }).send(res)
  }
}

module.exports = new CartController()
