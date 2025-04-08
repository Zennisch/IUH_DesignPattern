const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

// CRUD routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Additional route for stock availability check
router.post('/:id/check-stock', productController.checkStock);

module.exports = router;