'use strict'

const cart = require('@models/cart')
const BaseRepository = require('./base')

class CartRepository extends BaseRepository {
  constructor() {
    super(cart)
  }

  async findByUserId(userId) {
    return await cart.findOne({ userId })
  }

  async createCart(userId, product) {
    return await cart.create({
      userId: userId,
      state: 'active',
      products: [product],
    })
  }

  // check if product is in cart, if yes, increment quantity
  async checkProductInCartAndIncrement(userId, product) {
    const { productId, quantity } = product
    const query = {
      userId: userId,
      'products.productId': productId,
      state: 'active',
    }
    const update = {
      $inc: { 'products.$.quantity': quantity }, // increment quantity
    }

    return await cart.findOneAndUpdate(query, update, { new: true })
  }

  // check if product is in cart, if yes, set quantity
  async checkProductInCartAndSetQuantity(userId, product) {
    const { productId, quantity } = product
    const query = {
      userId: userId,
      'products.productId': productId,
      state: 'active',
    }
    const update = {
      $set: { 'products.$.quantity': quantity }, // set quantity
    }

    return await cart.findOneAndUpdate(query, update, { new: true })
  }

  async pushProductToCart({ userId, product }) {
    const query = { userId: userId, state: 'active' }
    const update = { $push: { products: product } }
    return await cart.findOneAndUpdate(query, update, { new: true })
  }

  static async deleteUserCartItems(userId, productIds) {
    const query = { cart_userId: userId, cart_state: 'active' }
    const updateSet = {
      $pull: {
        cart_products: {
          productId: { $in: productIds },
        },
      },
    }
    return await cart.updateOne(query, updateSet)
  }
}

module.exports = new CartRepository()
