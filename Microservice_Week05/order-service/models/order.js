const {pool} = require('../db/db');

class Order {
    static async getAll() {
        const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
        return result.rows;
    }

    static async getById(id) {
        const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
        const order = orderResult.rows[0];

        if (!order) return null;

        // Get order items
        const itemsResult = await pool.query(
            'SELECT * FROM order_items WHERE order_id = $1',
            [id]
        );

        order.items = itemsResult.rows;
        return order;
    }

    static async create(orderData) {
        const {customer_id, items} = orderData;

        // Start transaction
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Create order
            const orderResult = await client.query(
                'INSERT INTO orders (customer_id) VALUES ($1) RETURNING *',
                [customer_id]
            );

            const order = orderResult.rows[0];
            let totalAmount = 0;

            // Add order items
            if (items && items.length > 0) {
                for (const item of items) {
                    const {product_id, quantity, price} = item;
                    await client.query(
                        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
                        [order.id, product_id, quantity, price]
                    );
                    totalAmount += quantity * price;
                }

                // Update order total
                await client.query(
                    'UPDATE orders SET total_amount = $1 WHERE id = $2',
                    [totalAmount, order.id]
                );
            }

            await client.query('COMMIT');
            return this.getById(order.id);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async update(id, orderData) {
        const {status} = orderData;
        const result = await pool.query(
            `UPDATE orders 
             SET status = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 
             RETURNING *`,
            [status, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }

    static async getByCustomerId(customerId) {
        const result = await pool.query('SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC', [customerId]);
        return result.rows;
    }
}

module.exports = Order;