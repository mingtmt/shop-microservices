'use strict'

const SmartphoneFactory = require('./smartphone.factory')

class ProductFactoryResolver {
  static productRegistry = {
    smartphone: SmartphoneFactory,
    // add new product type here
  }

  static async createProduct(type, payload) {
    const productClass = this.productRegistry[type]
    if (!productClass) throw new Error(`Invalid Product Type: ${type}`)

    return new productClass(payload).createProduct()
  }

  static async updateProduct(type, id, payload) {
    const productClass = this.productRegistry[type]
    if (!productClass) throw new Error(`Invalid Product Type: ${type}`)

    return new productClass(payload).updateProduct(id)
  }

  static async deleteProduct(type, id) {
    const productClass = this.productRegistry[type]
    if (!productClass) throw new Error(`Invalid Product Type: ${type}`)

    return new productClass().deleteProduct(id)
  }
}

module.exports = ProductFactoryResolver
