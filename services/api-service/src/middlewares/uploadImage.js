'use strict'

const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('@configs/cloudinary')

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'shop-products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    // transform: [{ width: 500, height: 500, crop: 'limit' }],
  },
})

const uploadCloud = multer({ storage })

module.exports = uploadCloud
