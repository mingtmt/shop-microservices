'use strict'

const ProductService = require('@services/product')
const { OK, Created, NoContent } = require('@core/successResponse')

class ProductController {
  getAllProducts = async (req, res) => {
    const products = await ProductService.getAllProducts(req.query)

    new OK({
      message: 'Get all products successfully',
      data: products,
      metadata: {
        limit: req.query.limit || 50,
        page: req.query.page || 1,
        total: products.length,
      },
    }).send(res)
  }

  getAllProductsForAdmin = async (req, res) => {
    const products = await ProductService.getAllProductsForAdmin(req.query)

    new OK({
      message: 'Get all products for admin successfully',
      data: products,
      metadata: {
        limit: req.query.limit || 50,
        page: req.query.page || 1,
        total: products.length,
      },
    }).send(res)
  }

  getProductDetails = async (req, res) => {
    const product = await ProductService.getProductDetails(req.params.id)

    new OK({
      message: 'Get product details successfully',
      data: product,
    }).send(res)
  }

  getProductBySlug = async (req, res) => {
    const product = await ProductService.getProductBySlug(req.params.slug)

    new OK({
      message: 'Get product by slug successfully',
      data: product,
    }).send(res)
  }

  searchProducts = async (req, res) => {
    const products = await ProductService.searchProducts(req.query)

    new OK({
      message: 'Search products successfully',
      data: products,
      metadata: {
        total: products.length,
      },
    }).send(res)
  }

  createProduct = async (req, res) => {
    const thumbUrl = req.file ? req.file.path : null

    const payload = {
      ...req.body,
      thumbnail: thumbUrl,
    }

    const product = await ProductService.createProduct(payload)

    req.fileProcessed = true

    new Created({
      message: 'Product created successfully',
      data: product,
    }).send(res)
  }

  updateProduct = async (req, res) => {
    const product = await ProductService.updateProduct(req.params.id, req.body)

    new OK({
      message: 'Product updated successfully',
      data: product,
    }).send(res)
  }

  publishProduct = async (req, res) => {
    const product = await ProductService.publishProduct(req.params.id)

    new OK({
      message: 'Product published successfully',
      data: product,
    }).send(res)
  }

  unpublishProduct = async (req, res) => {
    const product = await ProductService.unpublishProduct(req.params.id)

    new OK({
      message: 'Product unpublished successfully',
      data: product,
    }).send(res)
  }

  deleteProduct = async (req, res) => {
    await ProductService.deleteProduct(req.params.id)

    new NoContent({
      message: 'Product deleted successfully',
    }).send(res)
  }
}

module.exports = new ProductController()
