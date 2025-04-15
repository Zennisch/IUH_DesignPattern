const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const router = express.Router();

// Get all inventory
router.get('/', inventoryController.getAllInventory);

// Get inventory by product ID
router.get('/product/:productId', inventoryController.getInventoryByProductId);

// Create or update inventory
router.post('/', inventoryController.createOrUpdateInventory);

// Reserve stock
router.post('/reserve', inventoryController.reserveStock);

// Commit reserved stock
router.post('/commit', inventoryController.commitReservation);

// Release reserved stock
router.post('/release', inventoryController.releaseReservation);

// Restock inventory
router.post('/restock', inventoryController.restockInventory);

// Get transaction history for a product
router.get('/product/:productId/transactions', inventoryController.getTransactions);

// Get low stock items
router.get('/low-stock', inventoryController.getLowStockItems);

module.exports = router;