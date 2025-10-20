const pool = require('../config/db');

class OrderModel {
  static async createOrder(user_id) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO orders (user_id, status) VALUES (?, 'pending')`,
        [user_id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        }
      );
    });
  }

  static async getProductById(productId) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM products WHERE id = ?`,
        [productId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });
  }

  static async addItemToOrder(orderId, item) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO order_items 
         (order_id, product_id, product_name, category, quantity, price) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.product_name,
          item.category,
          item.quantity,
          item.price
        ],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        }
      );
    });
  }

  static async getAllOrders() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT o.id AS order_id, u.username AS customer_name, o.status, o.created_at
         FROM orders o
         JOIN users u ON o.user_id = u.id
         ORDER BY o.created_at DESC`,
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }

  static async getOrderHeader(orderId) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT o.id AS order_id, o.status, o.created_at, u.username AS customer_name
         FROM orders o
         JOIN users u ON o.user_id = u.id
         WHERE o.id = ?`,
        [orderId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });
  }

  static async getOrderDetails(orderId) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT 
           product_name,
           category,
           quantity,
           price,
           (quantity * price) AS total_price
         FROM order_items
         WHERE order_id = ?`,
        [orderId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }

  static async getOrderTotal(orderId) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT SUM(quantity * price) AS total_price
         FROM order_items
         WHERE order_id = ?`,
        [orderId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0].total_price || 0);
        }
      );
    });
  }

  static async updateStatus(orderId, status) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE orders SET status = ? WHERE id = ?`,
        [status, orderId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }

  static async clearOrderItems(orderId) {
  return new Promise((resolve, reject) => {
    pool.query(
      `DELETE FROM order_items WHERE order_id = ?`,
      [orderId],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

  static async deleteOrder(orderId) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM order_items WHERE order_id = ?`,
        [orderId],
        (err) => {
          if (err) return reject(err);
          pool.query(
            `DELETE FROM orders WHERE id = ?`,
            [orderId],
            (err2) => {
              if (err2) return reject(err2);
              resolve();
            }
          );
        }
      );
    });
  }
};

module.exports = OrderModel;