const Product = require('../models/product');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.getAll();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.getById(req.params.id);
        if (!product) {
            return res.status(404).json({error: 'Product not found'});
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.update(req.params.id, req.body);
        if (!product) {
            return res.status(404).json({error: 'Product not found'});
        }
        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.delete(req.params.id);
        if (!product) {
            return res.status(404).json({error: 'Product not found'});
        }
        res.json({message: 'Product deleted successfully'});
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

// Check stock availability
exports.checkStock = async (req, res) => {
    try {
        const {id} = req.params;
        const {quantity} = req.body;

        const product = await Product.getById(id);
        if (!product) {
            return res.status(404).json({error: 'Product not found'});
        }

        const isAvailable = product.stock_quantity >= quantity;
        res.json({
            available: isAvailable,
            current_stock: product.stock_quantity,
            requested: quantity
        });
    } catch (error) {
        console.error('Error checking stock:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};