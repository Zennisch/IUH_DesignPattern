const { pool } = require('../db/db');

class Inventory {
  static async getAll() {
    const result = await pool.query('SELECT * FROM inventory ORDER BY product_id');
    return result.rows;
  }

  static async getByProductId(productId) {
    const result = await pool.query('SELECT * FROM inventory WHERE product_id = $1', [productId]);
    return result.rows[0];
  }

  static async createOrUpdate(inventoryData) {
    const { product_id, quantity, reorder_threshold } = inventoryData;
    
    // Check if inventory record already exists
    const existingInventory = await this.getByProductId(product_id);
    
    if (existingInventory) {
      // Update existing inventory
      const result = await pool.query(
        `UPDATE inventory 
         SET quantity = $1, 
             reorder_threshold = $2, 
             updated_at = CURRENT_TIMESTAMP 
         WHERE product_id = $3 
         RETURNING *`,
        [quantity, reorder_threshold, product_id]
      );
      return result.rows[0];
    } else {
      // Create new inventory record
      const result = await pool.query(
        'INSERT INTO inventory (product_id, quantity, reorder_threshold) VALUES ($1, $2, $3) RETURNING *',
        [product_id, quantity, reorder_threshold]
      );
      return result.rows[0];
    }
  }

  static async reserveStock(productId, quantity) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get current inventory with row lock
      const inventoryResult = await client.query(
        'SELECT * FROM inventory WHERE product_id = $1 FOR UPDATE',
        [productId]
      );
      
      const inventory = inventoryResult.rows[0];
      
      if (!inventory) {
        throw new Error(`No inventory record found for product ${productId}`);
      }
      
      // Check if enough stock available
      const availableStock = inventory.quantity - inventory.reserved_quantity;
      
      if (availableStock < quantity) {
        throw new Error(`Insufficient stock for product ${productId}. Available: ${availableStock}, Requested: ${quantity}`);
      }
      
      // Update reserved quantity
      const updatedInventory = await client.query(
        `UPDATE inventory 
         SET reserved_quantity = reserved_quantity + $1, 
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 
         RETURNING *`,
        [quantity, inventory.id]
      );
      
      // Record transaction
      await client.query(
        'INSERT INTO inventory_transactions (inventory_id, type, quantity, notes) VALUES ($1, $2, $3, $4)',
        [inventory.id, 'RESERVE', quantity, `Stock reserved for product ${productId}`]
      );
      
      await client.query('COMMIT');
      
      return updatedInventory.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async commitReservation(productId, quantity, reference_id) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get inventory record with lock
      const inventoryResult = await client.query(
        'SELECT * FROM inventory WHERE product_id = $1 FOR UPDATE',
        [productId]
      );
      
      const inventory = inventoryResult.rows[0];
      
      if (!inventory) {
        throw new Error(`No inventory record found for product ${productId}`);
      }
      
      // Update inventory quantities
      const updatedInventory = await client.query(
        `UPDATE inventory 
         SET quantity = quantity - $1, 
             reserved_quantity = reserved_quantity - $1, 
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 
         RETURNING *`,
        [quantity, inventory.id]
      );
      
      // Record transaction
      await client.query(
        'INSERT INTO inventory_transactions (inventory_id, type, quantity, reference_id, notes) VALUES ($1, $2, $3, $4, $5)',
        [inventory.id, 'COMMIT', quantity, reference_id, `Stock committed for order ${reference_id}`]
      );
      
      await client.query('COMMIT');
      
      return updatedInventory.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async releaseReservation(productId, quantity, reference_id) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get inventory record with lock
      const inventoryResult = await client.query(
        'SELECT * FROM inventory WHERE product_id = $1 FOR UPDATE',
        [productId]
      );
      
      const inventory = inventoryResult.rows[0];
      
      if (!inventory) {
        throw new Error(`No inventory record found for product ${productId}`);
      }
      
      // Update reserved quantity
      const updatedInventory = await client.query(
        `UPDATE inventory 
         SET reserved_quantity = reserved_quantity - $1, 
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 
         RETURNING *`,
        [quantity, inventory.id]
      );
      
      // Record transaction
      await client.query(
        'INSERT INTO inventory_transactions (inventory_id, type, quantity, reference_id, notes) VALUES ($1, $2, $3, $4, $5)',
        [inventory.id, 'RELEASE', quantity, reference_id, `Stock reservation released for product ${productId}`]
      );
      
      await client.query('COMMIT');
      
      return updatedInventory.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async restock(productId, quantity, reference_id) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get inventory record with lock
      const inventoryResult = await client.query(
        'SELECT * FROM inventory WHERE product_id = $1 FOR UPDATE',
        [productId]
      );
      
      const inventory = inventoryResult.rows[0];
      
      if (!inventory) {
        throw new Error(`No inventory record found for product ${productId}`);
      }
      
      // Update quantity
      const updatedInventory = await client.query(
        `UPDATE inventory 
         SET quantity = quantity + $1, 
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 
         RETURNING *`,
        [quantity, inventory.id]
      );
      
      // Record transaction
      await client.query(
        'INSERT INTO inventory_transactions (inventory_id, type, quantity, reference_id, notes) VALUES ($1, $2, $3, $4, $5)',
        [inventory.id, 'RESTOCK', quantity, reference_id, `Stock added for product ${productId}`]
      );
      
      await client.query('COMMIT');
      
      return updatedInventory.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  static async getTransactionsByProductId(productId) {
    const inventoryResult = await pool.query('SELECT id FROM inventory WHERE product_id = $1', [productId]);
    
    if (inventoryResult.rows.length === 0) {
      return [];
    }
    
    const inventoryId = inventoryResult.rows[0].id;
    
    const transactionsResult = await pool.query(
      'SELECT * FROM inventory_transactions WHERE inventory_id = $1 ORDER BY created_at DESC',
      [inventoryId]
    );
    
    return transactionsResult.rows;
  }

  static async getLowStockItems(threshold = null) {
    // If threshold is provided, use it; otherwise, use the reorder_threshold from each inventory item
    const query = threshold 
      ? 'SELECT * FROM inventory WHERE quantity <= $1 ORDER BY quantity ASC'
      : 'SELECT * FROM inventory WHERE quantity <= reorder_threshold ORDER BY quantity ASC';
    
    const result = threshold 
      ? await pool.query(query, [threshold])
      : await pool.query(query);
    
    return result.rows;
  }
}

module.exports = Inventory;