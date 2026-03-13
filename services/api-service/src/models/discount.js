'use strict'

const mongoose = require('mongoose')

const discountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    description: String,
    type: {
      type: String,
      default: 'fixed_amount', // fixed_amount, percentage
    },
    value: {
      type: Number,
      required: [true, 'Value is required'],
    },
    code: {
      type: String,
      required: [true, 'Code is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    maxUse: {
      type: Number,
      required: [true, 'Max use is required'],
    }, // number of times the discount can be used
    usedCount: {
      type: Number,
      default: 0,
    }, // number of times the discount has been used
    usersUsed: {
      type: Array,
      default: [],
    }, // list of users who used the discount
    perUserLimit: {
      type: Number,
      required: [true, 'Per user limit is required'],
    }, // number of times a user can use the discount
    minOrderValue: {
      type: Number,
      required: [true, 'Min order value is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applyTo: {
      type: String,
      enum: ['all', 'specific'],
      required: [true, 'Apply to is required'],
    },
    productIds: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'discounts',
  },
)

const discount = mongoose.model('Discount', discountSchema)

module.exports = discount
