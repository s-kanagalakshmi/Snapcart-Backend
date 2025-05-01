import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Create new order
router.post('/', async (req, res) => {
  const { userId, orderItems, totalPrice } = req.body;

  const order = new Order({
    user: userId,
    orderItems,
    totalPrice
  });

  try {
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ error: 'Error creating order' });
  }
});

// Get all orders (admin or user dashboard)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('orderItems.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
