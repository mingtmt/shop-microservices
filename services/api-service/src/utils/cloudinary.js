'use strict'

const cloudinary = require('@configs/cloudinary')

const removeImageByPublicId = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    console.log(`Deleted image ${publicId}:`, result)
    return result
  } catch (error) {
    console.error(`Error deleting image ${publicId}:`, error)
  }
}

module.exports = {
  removeImageByPublicId,
}
