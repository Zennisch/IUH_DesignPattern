const Order = require('../models/order');
const axios = require('axios');

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.getAll();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

// Get an order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.getById(req.params.id);
        if (!order) {
            return res.status(404).json({error: 'Order not found'});
        }
        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        // Check stock availability for all items before creating order
        const items = req.body.items || [];

        for (const item of items) {
            const stockResponse = await axios.post(
                `${process.env.PRODUCT_SERVICE_URL}/products/${item.product_id}/check-stock`,
                { quantity: item.quantity }
            );

            if (!stockResponse.data.available) {
                return res.status(400).json({
                    error: 'Insufficient stock',
                    product_id: item.product_id,
                    requested: item.quantity,
                    available: stockResponse.data.current_stock
                });
            }
        }

        const order = await Order.create(req.body);

        // Update product stock for each item
        for (const item of items) {
            await axios.put(
                `${process.env.PRODUCT_SERVICE_URL}/products/${item.product_id}`,
                { stock_quantity: -item.quantity }
            );
        }

        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

// Update an order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.update(req.params.id, req.body);
        if (!order) {
            return res.status(404).json({error: 'Order not found'});
        }
        res.json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.delete(req.params.id);
        if (!order) {
            return res.status(404).json({error: 'Order not found'});
        }
        res.json({message: 'Order deleted successfully'});
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

// Get orders by customer ID
exports.getOrdersByCustomer = async (req, res) => {
    try {
        const orders = await Order.getByCustomerId(req.params.customerId);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};