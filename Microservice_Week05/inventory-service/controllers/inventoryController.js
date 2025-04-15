const Inventory = require('../models/inventory');
const axios = require('axios');

// Get all inventory items
exports.getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.getAll();
    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get inventory by product ID
exports.getInventoryByProductId = async (req, res) => {
  try {
    const inventory = await Inventory.getByProductId(req.params.productId);
    
    if (!inventory) {
      return res.status(404).json({ error: 'Inventory record not found' });
    }
    
    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create or update inventory
exports.createOrUpdateInventory = async (req, res) => {
  try {
    const { product_id, quantity, reorder_threshold } = req.body;
    
    // Validate input
    if (!product_id || quantity === undefined) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }
    
    // Check if product exists in product service
    try {
      await axios.get(`${process.env.PRODUCT_SERVICE_URL}/products/${product_id}`);
    } catch (error) {
      return res.status(400).json({ error: 'Product not found in product service' });
    }
    
    const inventory = await Inventory.createOrUpdate({
      product_id,
      quantity,
      reorder_threshold: reorder_threshold || 5
    });
    
    res.json(inventory);
  } catch (error) {
    console.error('Error creating/updating inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Reserve stock for an order
exports.reserveStock = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    
    // Validate input
    if (!product_id || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }
    
    try {
      const inventory = await Inventory.reserveStock(product_id, quantity);
      res.json({ 
        success: true, 
        message: 'Stock reserved successfully', 
        inventory 
      });
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        error: error.message 
      });
    }
  } catch (error) {
    console.error('Error reserving stock:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Commit reserved stock (when order is finalized)
exports.commitReservation = async (req, res) => {
  try {
    const { product_id, quantity, order_id } = req.body;
    
    // Validate input
    if (!product_id || !quantity || !order_id) {
      return res.status(400).json({ error: 'Product ID, quantity, and order ID are required' });
    }
    
    try {
      const inventory = await Inventory.commitReservation(product_id, quantity, `order:${order_id}`);
      res.json({ 
        success: true, 
        message: 'Stock committed successfully', 
        inventory 
      });
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        error: error.message 
      });
    }
  } catch (error) {
    console.error('Error committing stock:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Release reserved stock (when order is cancelled)
exports.releaseReservation = async (req, res) => {
  try {
    const { product_id, quantity, order_id } = req.body;
    
    // Validate input
    if (!product_id || !quantity || !order_id) {
      return res.status(400).json({ error: 'Product ID, quantity, and order ID are required' });
    }
    
    try {
      const inventory = await Inventory.releaseReservation(product_id, quantity, `order:${order_id}`);
      res.json({ 
        success: true, 
        message: 'Reservation released successfully', 
        inventory 
      });
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        error: error.message 
      });
    }
  } catch (error) {
    console.error('Error releasing reservation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Restock inventory
exports.restockInventory = async (req, res) => {
  try {
    const { product_id, quantity, reference_id } = req.body;
    
    // Validate input
    if (!product_id || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }
    
    try {
      const inventory = await Inventory.restock(
        product_id, 
        quantity, 
        reference_id || `manual:${new Date().toISOString()}`
      );
      
      res.json({ 
        success: true, 
        message: 'Inventory restocked successfully', 
        inventory 
      });
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        error: error.message 
      });
    }
  } catch (error) {
    console.error('Error restocking inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get inventory transactions by product ID
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Inventory.getTransactionsByProductId(req.params.productId);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get low stock items
exports.getLowStockItems = async (req, res) => {
  try {
    const { threshold } = req.query;
    const lowStockItems = await Inventory.getLowStockItems(threshold ? parseInt(threshold) : null);
    res.json(lowStockItems);
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};