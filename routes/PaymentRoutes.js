import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: 'YOUR_KEY_ID',
  key_secret: 'YOUR_KEY_SECRET'
});

// Create order
router.post('/create-order', async (req, res) => {
  const { totalPrice } = req.body;

  try {
    const options = {
      amount: totalPrice * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify and save order
router.post('/verify', async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    orderItems,
    totalPrice
  } = req.body;

  const secret = 'YOUR_KEY_SECRET';
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const signature = hmac.digest('hex');

  if (signature === razorpay_signature) {
    const newOrder = new Order({
      user: userId,
      orderItems,
      totalPrice,
      isPaid: true,
      paidAt: new Date()
    });

    await newOrder.save();
    res.status(200).json({ success: true, message: 'Payment verified and order saved' });
  } else {
    res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
});

export default router;
