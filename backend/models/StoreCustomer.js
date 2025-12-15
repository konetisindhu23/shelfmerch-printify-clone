const mongoose = require('mongoose');

const StoreCustomerSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      index: true,
    },
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    email: {
      type: String,
      index: true,
    },
    name: {
      type: String,
    },
    passwordHash: {
      type: String,
    },
    lastSeenAt: {
      type: Date,
    },
    marketingOptIn: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

StoreCustomerSchema.index({ storeId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('StoreCustomer', StoreCustomerSchema);
