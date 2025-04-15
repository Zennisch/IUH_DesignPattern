const express = require('express');
const customerController = require('../controllers/customerController');
const router = express.Router();

// CRUD routes
router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

// Additional routes
router.get('/email/:email', customerController.getCustomerByEmail);

module.exports = router;