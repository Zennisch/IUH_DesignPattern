const amqp = require('amqplib');
require('dotenv').config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';

class MessagePublisher {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async initialize() {
    try {
      this.connection = await amqp.connect(RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      
      // Declare exchanges
      await this.channel.assertExchange('inventory_events', 'topic', { durable: true });
      
      console.log('RabbitMQ publisher initialized');
    } catch (error) {
      console.error('Failed to initialize RabbitMQ publisher:', error);
      setTimeout(() => this.initialize(), 5000); // Try to reconnect after 5 seconds
    }
  }

  async publishLowStockEvent(productData) {
    if (!this.channel) {
      throw new Error('Publisher not initialized');
    }
    
    try {
      const message = Buffer.from(JSON.stringify(productData));
      this.channel.publish('inventory_events', 'inventory.low_stock', message);
      console.log('Low stock event published for product:', productData.product_id);
    } catch (error) {
      console.error('Failed to publish low stock event:', error);
    }
  }

  async publishStockUpdatedEvent(productData) {
    if (!this.channel) {
      throw new Error('Publisher not initialized');
    }
    
    try {
      const message = Buffer.from(JSON.stringify(productData));
      this.channel.publish('inventory_events', 'inventory.updated', message);
      console.log('Stock updated event published for product:', productData.product_id);
    } catch (error) {
      console.error('Failed to publish stock updated event:', error);
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

module.exports = new MessagePublisher();