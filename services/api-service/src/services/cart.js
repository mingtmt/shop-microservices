'use strict'

const CartRepository = require('@repositories/cart')
const ProductRepository = require('@repositories/product')
const { BadRequestError } = require('@core/errorResponse')

class CartService {
  static async addToCart(userId, product) {
    const foundProduct = await ProductRepository.findById(product.productId)
    if (!foundProduct) {
      throw new BadRequestError('Product not found')
    }

    const cartItemPayload = {
      productId: product.productId,
      quantity: product.quantity,
      name: foundProduct.name,
      price: foundProduct.price,
      thumbnail: foundProduct.thumbnail,
    }

    const userCart = await CartRepository.findByUserId(userId)

    // don't have cart yet
    if (!userCart) {
      return await CartRepository.createCart(userId, cartItemPayload)
    }

    // exist cart, check if product is in cart
    const existingProduct = await CartRepository.checkProductInCartAndIncrement(userId, product)

    if (existingProduct) return existingProduct

    // exist cart, no item in cart, push to cart
    return await CartRepository.pushProductToCart({
      userId,
      product: cartItemPayload,
    })
  }

  static async updateCartQuantity(userId, product) {
    const { productId, quantity } = product
    if (quantity < 0) {
      throw new BadRequestError('Quantity invalid')
    }

    // if quantity = 0 -> delete product
    if (quantity === 0) {
      return await CartRepository.deleteCartItem(userId, productId)
    }

    // update product quantity
    return await CartRepository.checkProductInCartAndSetQuantity(userId, product)
  }

  static async deleteCartItems(userId, productIds) {
    return await CartRepository.deleteCartItem(userId, productIds)
  }

  static async getListCartItems(userId) {
    return await CartRepository.findByUserId(userId)
  }
}

module.exports = CartService
