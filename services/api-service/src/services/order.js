'use strict'

const CartRepository = require('@repositories/cart')
const ProductRepository = require('@repositories/product')
const OrderRepository = require('@repositories/order')
const InventoryService = require('@services/inventory')
const CartService = require('@services/cart')
const { NotFoundError, BadRequestError } = require('@core/errorResponse')

class CheckoutService {
  static async orderReview({ userId, cartId, products }) {
    const foundCart = await CartRepository.findById(cartId)
    if (!foundCart) {
      throw new NotFoundError({ message: 'Cart not found' })
    }

    if (foundCart.state !== 'active') {
      throw new NotFoundError({ message: 'Cart is not active' })
    }

    const productsInCart = await ProductRepository.checkProductInCart(products)
    if (!productsInCart || productsInCart.length === 0) {
      throw new BadRequestError('Order wrong!!!')
    }

    const totalPrice = productsInCart.reduce((acc, product) => {
      return acc + product.price * product.quantity
    }, 0)

    // TODO: get ship fee
    const feeShip = 30000
    // TODO: get discount amount
    const totalDiscount = 0

    const totalCheckout = totalPrice + feeShip - totalDiscount

    return {
      productsInCart,
      checkoutOrder: {
        totalPrice,
        feeShip,
        totalDiscount,
        totalCheckout,
      },
    }
  }

  static async orderByUser({ userId, cartId, products }) {
    const { productsInCart, checkoutOrder } = await this.orderReview({
      userId,
      cartId,
      products,
    })

    const acquiredProducts = []

    for (let i = 0; i < productsInCart.length; i++) {
      const { productId, quantity } = products[i]

      const keyLock = await InventoryService.reservationInventory({
        productId,
        quantity,
        cartId,
      })

      if (keyLock) {
        acquiredProducts.push(products[i])
      }
    }

    const newOrder = await OrderRepository.create({
      userId: userId,
      checkout: checkoutOrder,
      products: productsInCart,
    })

    if (newOrder) {
      await CartService.deleteCartItems({
        userId,
        productIds: productsInCart.map((p) => p.productId),
      })
    }

    return newOrder
  }
}

module.exports = CheckoutService
