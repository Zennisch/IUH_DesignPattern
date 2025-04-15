const amqp = require('amqplib');
const Inventory = require('../models/inventory');
require('dotenv').config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';

class MessageConsumer {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async initialize() {
    try {
      this.connection = await amqp.connect(RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      
      // Declare exchanges and queues
      await this.channel.assertExchange('order_events', 'topic', { durable: true });
      await this.channel.assertQueue('inventory_order_events', { durable: true });
      
      // Bind queue to exchange with routing keys
      await this.channel.bindQueue('inventory_order_events', 'order_events', 'order.created');
      await this.channel.bindQueue('inventory_order_events', 'order_events', 'order.status_changed');
      
      // Start consuming messages
      await this.channel.consume('inventory_order_events', async (msg) => {
        if (msg !== null) {
          try {
            const content = JSON.parse(msg.content.toString());
            const routingKey = msg.fields.routingKey;
            
            console.log(`Received message with routing key: ${routingKey}`);
            console.log('Message content:', content);
            
            switch (routingKey) {
              case 'order.created':
                await this.handleOrderCreated(content);
                break;
              case 'order.status_changed':
                await this.handleOrderStatusChanged(content);
                break;
              default:
                console.log(`Ignoring message with unknown routing key: ${routingKey}`);
            }
            
            // Acknowledge message
            this.channel.ack(msg);
          } catch (error) {
            console.error('Error processing message:', error);
            // Requeue the message if processing fails
            this.channel.nack(msg, false, true);
          }
        }
      });
      
      console.log('RabbitMQ consumer initialized and listening for messages');
    } catch (error) {
      console.error('Failed to initialize RabbitMQ consumer:', error);
      // Try to reconnect after a delay
      setTimeout(() => this.initialize(), 5000);
    }
  }

  async handleOrderCreated(order) {
    try {
      console.log('Processing new order:', order.id);
      
      // For each item, commit the reservation
      if (order.items && order.items.length > 0) {
        for (const item of order.items) {
          await Inventory.commitReservation(
            item.product_id, 
            item.quantity, 
            `order:${order.id}`
          );
          console.log(`Committed ${item.quantity} units of product ${item.product_id} for order ${order.id}`);
        }
      }
    } catch (error) {
      console.error('Error processing order created event:', error);
    }
  }

  async handleOrderStatusChanged(order) {
    try {
      console.log(`Processing order status change: Order ${order.id} is now ${order.status}`);
      
      // If order is cancelled, return items to inventory
      if (order.status === 'cancelled') {
        if (order.items && order.items.length > 0) {
          for (const item of order.items) {
            // Increase the inventory (restock)
            await Inventory.restock(
              item.product_id, 
              item.quantity, 
              `order_cancelled:${order.id}`
            );
            console.log(`Returned ${item.quantity} units of product ${item.product_id} to inventory due to order cancellation`);
          }
        }
      }
    } catch (error) {
      console.error('Error processing order status changed event:', error);
    }
  }

  async close() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}

module.exports = new MessageConsumer();