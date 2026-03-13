'use strict'

const InventoryService = require('@services/inventory')
const { OK } = require('@core/successResponse')

class InventoryController {
  addStockToInventory = async (req, res) => {
    const newInventory = await InventoryService.addStockToInventory(req.body)

    new OK({
      message: 'Add Stock to Inventory success',
      data: newInventory,
    }).send(res)
  }
}

module.exports = new InventoryController()
