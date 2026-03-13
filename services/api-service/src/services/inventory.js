'use strict'

const InventoryRepository = require('@repositories/inventory')
const ProductRepository = require('@services/product')
const RedisService = require('@services/redis')
const { NotFoundError, BadRequestError } = require('@core/errorResponse')

class InventoryService {
  static async addStockToInventory({ productId, location, stock }) {
    const product = await ProductRepository.findById(productId)
    if (!product) {
      throw new NotFoundError({ message: 'Product not found' })
    }

    return await InventoryRepository.addStockToInventory({
      productId,
      location,
      stock,
    })
  }

  static async reservationInventory({ productId, cartId, quantity }) {
    const isLocked = await RedisService.acquireLock(productId, quantity, cartId)

    // Nếu sau khi retry mà vẫn không lấy được lock -> Có nghĩa là sản phẩm đang quá "hot"
    if (!isLocked) {
      throw new BadRequestError('Something went wrong')
    }

    try {
      // 2. Nếu lấy được lock -> Được quyền vào kho trừ hàng
      // Gọi Repository để thực hiện trừ DB ($inc -quantity)
      const reservationResult = await InventoryRepository.reservationInventory({
        productId,
        quantity,
        cartId,
      })

      // Nếu DB trả về null -> Nghĩa là điều kiện stock >= quantity không thỏa mãn
      if (!reservationResult) {
        throw new BadRequestError('Product stock is not enough')
      }

      // Trừ kho thành công -> Trả về kết quả
      return reservationResult
    } finally {
      // 3. QUAN TRỌNG: Giải phóng khóa (Release Lock)
      // Dùng khối finally để đảm bảo dù DB có lỗi hay code crash, khóa vẫn được mở
      // để người đến sau còn mua được hàng.
      await RedisService.releaseLock(productId)
    }
  }
}

module.exports = InventoryService
