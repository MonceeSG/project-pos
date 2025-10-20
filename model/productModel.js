const pool = require('../config/db');

class ProductModel {
    // Add product
    static async addProduct(product) {
        return new Promise((resolve, reject) => {
            const { name, category, quantity, price, imageUrl } = product;
            pool.query(
                'INSERT INTO products (name, category, quantity, price, image_url) VALUES (?, ?, ?, ?, ?)',
                [name, category, quantity, price, imageUrl],
                (error, results) => {
                    if (error) return reject(error);
                    resolve(results.insertId);
                }
            );
        });
    }

    // Get all products
    static async getAllProducts() {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM products', (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    // Get product by id
    static async getProductById(id) {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM products WHERE id = ?', [id], (error, results) => {
                if (error) return reject(error);
                resolve(results[0] || null);
            });
        });
    }

    // Update product
    static async updateProduct(id, data) {
        const { name, category, quantity, price, imageUrl } = data;
        return new Promise((resolve, reject) => {
            pool.query(
                'UPDATE products SET name = ?, category = ?, quantity = ?, price = ?, image_url = ? WHERE id = ?',
                [name, category, quantity, price, imageUrl, id],
                (error, results) => {
                    if (error) {
                        console.error('Error updating product:', error);
                    return reject(error);
                 }
                    resolve(results.affectedRows > 0);
                }
            );
        });
    }

    static async reduceStock(productId, quantity) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE products SET quantity = quantity - ? WHERE id = ?`,
        [quantity, productId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }

    // Delete product
    static async deleteProduct(id) {
        return new Promise((resolve, reject) => {
            pool.query('DELETE FROM products WHERE id = ?', [id], (error, results) => {
                if (error) return reject(error);
                resolve(results.affectedRows > 0);
            });
        });
    }
}

module.exports = ProductModel;    