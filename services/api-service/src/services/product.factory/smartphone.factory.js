'use strict'

const { smartphone } = require('@models/electronic')
const ProductRepository = require('@repositories/product')
const BaseProductFactory = require('./base-product.factory')
const { BadRequestError } = require('@core/errorResponse')
const { removeUndefined, updateNestedObjectParser } = require('@utils')

class SmartphoneFactory extends BaseProductFactory {
  async createProduct() {
    const newProduct = await super.createProduct()

    if (!newProduct) {
      throw new BadRequestError('Create Base Product Error')
    }

    const { attributes, createdBy, updatedBy } = this.payload
    const newSmartphonePayload = {
      _id: newProduct._id,
      ...attributes,
      createdBy,
      updatedBy,
    }

    const newSmartphone = await ProductRepository.createByModel(smartphone, newSmartphonePayload)
    if (!newSmartphone) {
      await ProductRepository.deleteById(newProduct._id)
      throw new BadRequestError('Create New Smartphone Error')
    }

    return newProduct
  }

  async updateProduct(id) {
    const payload = removeUndefined(this.payload)

    if (payload.attributes) {
      await ProductRepository.updateByModel({
        model: smartphone,
        id,
        payload: updateNestedObjectParser(payload.attributes),
      })
    }

    const updatedProduct = await super.updateProduct(id, updateNestedObjectParser(payload))

    return updatedProduct
  }

  async deleteProduct(id) {
    const deletedSmartphone = await ProductRepository.deleteByModel(smartphone, id)
    if (!deletedSmartphone) {
      throw new BadRequestError('Delete Smartphone Error')
    }

    return await super.deleteProduct(id)
  }
}

module.exports = SmartphoneFactory
