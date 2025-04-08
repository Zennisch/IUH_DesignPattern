const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

// CRUD routes
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrderStatus);
router.delete('/:id', orderController.deleteOrder);

// Additional routes
router.get('/customer/:customerId', orderController.getOrdersByCustomer);

module.exports = router;