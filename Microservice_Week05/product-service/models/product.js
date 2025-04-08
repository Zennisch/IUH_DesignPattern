const { pool } = require('../db/db');

class Product {
  static async getAll() {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(productData) {
    const { name, description, price, stock_quantity } = productData;
    const result = await pool.query(
      'INSERT INTO products (name, description, price, stock_quantity) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, stock_quantity]
    );
    return result.rows[0];
  }

  static async update(id, productData) {
    const { name, description, price, stock_quantity } = productData;
    const result = await pool.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, stock_quantity = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 
       RETURNING *`,
      [name, description, price, stock_quantity, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  // Method to check and update stock
  static async updateStock(id, quantity) {
    const result = await pool.query(
      `UPDATE products 
       SET stock_quantity = stock_quantity - $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 AND stock_quantity >= $1
       RETURNING *`,
      [quantity, id]
    );
    return result.rows[0];
  }
}

module.exports = Product;