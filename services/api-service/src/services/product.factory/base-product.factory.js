'use strict'

const ProductRepository = require('@repositories/product')

class BaseProductFactory {
  constructor(payload) {
    this.payload = payload
  }

  async createProduct() {
    const newProduct = await ProductRepository.create(this.payload)

    return newProduct
  }

  async updateProduct(id, payload) {
    const updatedProduct = await ProductRepository.updateById({
      id,
      payload: payload,
    })

    return updatedProduct
  }

  async deleteProduct(id) {
    return await ProductRepository.deleteById(id)
  }
}

module.exports = BaseProductFactory
