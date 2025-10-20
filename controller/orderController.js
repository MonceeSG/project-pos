const OrderModel = require('../model/orderModel');
const ProductModel = require('../model/productModel');

class orderController {
  async createOrder(req, res) {
  try {
    const { user_id, items } = req.body;

    // 🔍 Validasi user_id
    if (!user_id || typeof user_id !== 'number') {
      return res.status(400).json({ message: 'Invalid or missing user_id' });
    }

    // 🔍 Validasi items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items must be a non-empty array' });
    }

    // 🔍 Validasi tiap item dan stok
    const validatedItems = [];

    for (const item of items) {
      if (
        !item.product_id ||
        typeof item.product_id !== 'number' ||
        !item.quantity ||
        typeof item.quantity !== 'number' ||
        item.quantity <= 0
      ) {
        return res.status(400).json({ message: 'Each item must have valid product_id and quantity > 0' });
      }

      const product = await ProductModel.getProductById(item.product_id);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product_id} not found` });
      }

      if (item.quantity > product.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for '${product.product_name}'. Requested: ${item.quantity}, Available: ${product.quantity}`
        });
      }

      if (!product.product_name || !product.category || !product.price) {
        return res.status(500).json({
          message: `Product ${item.product_id} has incomplete data`,
          error: {
            product_name: product.product_name,
            category: product.category,
            price: product.price
          }
        });
      }

      validatedItems.push({ ...item, product }); // simpan product biar gak query ulang
    }

    // ✅ Buat order
    const orderId = await OrderModel.createOrder(user_id);

    // ✅ Tambahkan item dan kurangi stok
    for (const { product_id, quantity, product } of validatedItems) {
      await OrderModel.addItemToOrder(orderId, {
        product_id,
        product_name: product.product_name,
        category: product.category,
        quantity,
        price: product.price
      });

      await ProductModel.reduceStock(product_id, quantity);
    }

    res.status(201).json({ message: 'Order created', order_id: orderId });
  } catch (err) {
    console.error('❌ Error creating order:', err);
    res.status(500).json({
      message: 'Error creating order',
      error: err.message || err.sqlMessage || err.toString() || 'Unknown error'
    });
  }
}

  async getAllOrders(req, res) {
    try {
      const orders = await OrderModel.getAllOrders();
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching orders', error: err });
    }
  }

  async getOrderDetails(req, res) {
    try {
      const { id } = req.params;
      const header = await OrderModel.getOrderHeader(id);
      const items = await OrderModel.getOrderDetails(id);
      const total = await OrderModel.getOrderTotal(id);

      if (!header || items.length === 0) {
        return res.status(404).json({ message: 'Order not found or has no items' });
      }

      res.json({
        order_id: header.order_id,
        customer_name: header.customer_name,
        status: header.status,
        created_at: header.created_at,
        total_price: total,
        items
      });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching order details', error: err });
    }
  }

  async updateOrder(req, res) {
  try {
    const { id } = req.params;
    const { status, items } = req.body;

    // 🔍 Validasi status
    const allowed = ['pending', 'paid', 'cancelled'];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // 🔍 Validasi items
    if (items && (!Array.isArray(items) || items.length === 0)) {
      return res.status(400).json({ message: 'Items must be a non-empty array' });
    }

    // ✅ Update status kalau ada
    if (status) {
      await OrderModel.updateStatus(id, status);
    }

    // ✅ Update items kalau ada
    if (items) {
      await OrderModel.clearOrderItems(id); // hapus semua item lama

      for (const item of items) {
        const product = await ProductModel.getProductById(item.product_id);
        await OrderModel.addItemToOrder(id, {
          product_id: item.product_id,
          product_name: product.product_name,
          category: product.category,
          quantity: item.quantity,
          price: product.price
        });
      }
    }

    res.json({ message: `Order ${id} updated successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order', error: err });
  }
}


  async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      await OrderModel.deleteOrder(id);
      res.json({ message: `Order ${id} deleted` });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting order', error: err });
    }
  }
};

module.exports = new orderController;