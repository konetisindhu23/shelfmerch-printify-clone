const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const StoreCustomer = require('../models/StoreCustomer');
const StoreOrder = require('../models/StoreOrder');

// POST /api/store-checkout/:subdomain
// Public endpoint used by storefront checkout to create an order
router.post('/store-checkout/:subdomain', async (req, res) => {
  try {
    const { subdomain } = req.params;
    const { cart, shippingInfo } = req.body || {};

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    if (!shippingInfo || !shippingInfo.email || !shippingInfo.fullName) {
      return res.status(400).json({ success: false, message: 'Missing shipping information' });
    }

    const store = await Store.findOne({ slug: subdomain, isActive: true }).lean();
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    const merchantId = store.merchant;

    // 1) Find or create StoreCustomer
    let customer = await StoreCustomer.findOne({ storeId: store._id, email: shippingInfo.email });
    if (!customer) {
      customer = await StoreCustomer.create({
        storeId: store._id,
        merchantId,
        email: shippingInfo.email,
        name: shippingInfo.fullName,
        lastSeenAt: new Date(),
      });
    } else {
      customer.lastSeenAt = new Date();
      await customer.save();
    }

    // 2) Compute totals (mirror frontend for now)
    const subtotal = cart.reduce(
      (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
      0
    );
    const shipping = cart.length > 0 ? 5.99 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    // 3) Build order items
    const orderItems = cart.map((item) => ({
      storeProductId: item.product?.id || item.product?._id || undefined,
      productName: item.product?.name,
      mockupUrl: item.product?.mockupUrls?.[0] || item.product?.mockupUrl,
      mockupUrls: item.product?.mockupUrls || [],
      quantity: item.quantity,
      price: item.product?.price,
      variant: item.variant,
    }));

    const order = await StoreOrder.create({
      merchantId,
      storeId: store._id,
      customerId: customer._id,
      customerEmail: shippingInfo.email,
      items: orderItems,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress: shippingInfo,
    });

    return res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('store-checkout error:', error);
    return res.status(500).json({ success: false, message: 'Failed to place order' });
  }
});

module.exports = router;
