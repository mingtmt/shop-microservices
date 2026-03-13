'use strict'

const ProductFactoryResolver = require('./product.factory')
const ProductRepository = require('@repositories/product')
const InventoryRepository = require('@repositories/inventory')
const { NotFoundError } = require('@core/errorResponse')
const NotificationService = require('./notification')

class ProductService {
  static async getAllProducts(query) {
    const { page, limit, sort, ...filter } = query
    return await ProductRepository.findAll({
      filter: {
        isPublished: true,
        ...filter,
      },
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 50,
      sort: sort || 'createdAt',
      select: 'name price thumbnail',
    })
  }

  static async getAllProductsForAdmin(query) {
    const { page, limit, sort, ...filter } = query

    return await ProductRepository.getAllProductsWithInventory({
      filter: filter,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 50,
      sort: sort || 'createdAt',
      select: '_id thumbnail name price stock type isDraft',
    })
  }

  static async getProductById(id) {
    const product = await ProductRepository.findById(id)

    if (!product) {
      throw new NotFoundError({ message: 'Product not found' })
    }

    return product
  }

  static async getProductBySlug(slug) {
    const product = await ProductRepository.findBySlug(slug)

    if (!product) {
      throw new NotFoundError({ message: 'Product not found' })
    }

    return product
  }

  static async searchProducts(query) {
    const { keySearch } = query
    return await ProductRepository.searchProducts(keySearch)
  }

  static async createProduct(payload) {
    const newProduct = await ProductFactoryResolver.createProduct(payload.type, payload)

    await InventoryRepository.insertInventory({
      productId: newProduct._id,
      stock: payload.stock,
    })

    await NotificationService.pushNotiToSystem({
      type: 'SHOP-001',
      receiverId: 1,
      options: {
        name: newProduct.name,
      },
    })

    return newProduct
  }

  static async updateProduct(id, payload) {
    const product = await ProductRepository.findById(id)
    if (!product) {
      throw new NotFoundError({ message: 'Product not found' })
    }

    return await ProductFactoryResolver.updateProduct(payload.type, id, payload)
  }

  static async deleteProduct(id) {
    const product = await ProductRepository.findById(id)
    if (!product) {
      throw new NotFoundError({ message: 'Product not found' })
    }
    const type = product.type

    return await ProductFactoryResolver.deleteProduct(type, id)
  }
}

module.exports = ProductService
