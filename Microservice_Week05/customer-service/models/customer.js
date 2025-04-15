const {pool} = require('../db/db');

class Customer {
    static async getAll() {
        const result = await pool.query('SELECT * FROM customers ORDER BY id');
        return result.rows;
    }

    static async getById(id) {
        const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async getByEmail(email) {
        const result = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async create(customerData) {
        const {name, email, phone, address} = customerData;
        const result = await pool.query(
            'INSERT INTO customers (name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, phone, address]
        );
        return result.rows[0];
    }

    static async update(id, customerData) {
        const {name, email, phone, address} = customerData;
        const result = await pool.query(
            `UPDATE customers
             SET name = $1,
                 email = $2,
                 phone = $3,
                 address = $4,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $5 RETURNING *`,
            [name, email, phone, address, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}

module.exports = Customer;