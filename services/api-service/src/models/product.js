'use strict'

const mongoose = require('mongoose')
const slugify = require('slugify')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [150, 'Name cannot exceed 50 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0.01, 'Price must be at least 0.01'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Image is required'],
      trim: true,
      minlength: [3, 'Image must be at least 3 characters'],
    },
    images: {
      type: Array,
      default: [],
    },
    type: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['smartphone', 'tablet', 'laptop'],
    },
    attributes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating average must be at least 1'],
      max: [5, 'Rating average must be at most 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by is required'],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)

// Index for search
productSchema.index({ name: 1, slug: 1 })

// Auto generate slug
productSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true })
  }
})

productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Product = mongoose.model(DOCUMENT_NAME, productSchema)

module.exports = Product
