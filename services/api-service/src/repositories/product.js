'use strict'

const Product = require('@models/product')
const BaseRepository = require('./base')
const { getSelectData } = require('@utils')

class ProductRepository extends BaseRepository {
  constructor() {
    super(Product)
  }

  async getAllProductsWithInventory({
    filter = {},
    limit = 50,
    page = 1,
    sort = 'createdAt',
    select = '',
  }) {
    const skip = (page - 1) * limit
    const sortBy = sort === 'createdAt' ? { createdAt: -1 } : { [sort]: 1 }

    let projectStage = { inventory_data: 0, __v: 0 }

    if (select) {
      const selectObj = getSelectData(select)

      selectObj.stock = 1

      projectStage = selectObj
    }

    return await Product.aggregate([
      { $match: filter },
      { $sort: sortBy },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'Inventories',
          localField: '_id',
          foreignField: 'productId',
          as: 'inventory_data',
        },
      },
      {
        $unwind: {
          path: '$inventory_data',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $addFields: {
          stock: { $ifNull: ['$inventory_data.stock', 0] },
        },
      },

      {
        $project: projectStage,
      },
    ])
  }

  async findBySlug(slug, select = '') {
    return await Product.findOne({ slug }).select(select)
  }

  async searchProducts(keySearch) {
    const regexSearch = new RegExp(keySearch, 'i')

    return await Product.find({
      isPublished: true,
      $or: [{ name: { $regex: regexSearch } }, { slug: { $regex: regexSearch } }],
    })
      .sort({ createdAt: -1 })
      .select('name thumbnail price')
      .lean()
  }

  async createByModel(model, payload) {
    return await model.create(payload)
  }

  async updateByModel({ model, id, payload, isNew = true }) {
    return await model.findByIdAndUpdate(id, payload, {
      new: isNew,
      runValidators: true,
    })
  }

  async deleteByModel(model, id) {
    return await model.findByIdAndDelete(id)
  }

  async checkProductInCart(products) {
    return await Promise.all(
      products.map(async (product) => {
        const foundProduct = await this.findById(product.productId)
        if (foundProduct) {
          return {
            ...product,
            price: foundProduct.price,
          }
        }
      }),
    )
  }
}

module.exports = new ProductRepository()
