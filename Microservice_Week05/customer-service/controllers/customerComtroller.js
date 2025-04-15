const Customer = require('../models/customer');

// Get all customers
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.getAll();
        res.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

// Get a customer by ID
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.getById(req.params.id);
        if (!customer) {
            return res.status(404).json({error: 'Customer not found'});
        }
        res.json(customer);
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

// Get a customer by email
exports.getCustomerByEmail = async (req, res) => {
    try {
        const customer = await Customer.getByEmail(req.params.email);
        if (!customer) {
            return res.status(404).json({error: 'Customer not found'});
        }
        res.json(customer);
    } catch (error) {
        console.error('Error fetching customer by email:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

// Create a new customer
exports.createCustomer = async (req, res) => {
    try {
        const existingCustomer = await Customer.getByEmail(req.body.email);
        if (existingCustomer) {
            return res.status(409).json({error: 'Email already in use'});
        }
        const customer = await Customer.create(req.body);
        res.status(201).json(customer);
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
    try {
        if (req.body.email) {
            const existingCustomer = await Customer.getByEmail(req.body.email);
            if (existingCustomer && existingCustomer.id != req.params.id) {
                return res.status(409).json({error: 'Email already in use'});
            }
        }
        
        const customer = await Customer.update(req.params.id, req.body);
        if (!customer) {
            return res.status(404).json({error: 'Customer not found'});
        }
        res.json(customer);
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.delete(req.params.id);
        if (!customer) {
            return res.status(404).json({error: 'Customer not found'});
        }
        res.json({message: 'Customer deleted successfully'});
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};