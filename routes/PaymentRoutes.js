import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import { verifyFirebaseToken } from '../middleware/firebaseAuth.js';

dotenv.config();
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/create-order', verifyFirebaseToken, async (req, res) => {
  const { totalPrice } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: totalPrice * 100,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});
router.post('/checkout', verifyFirebaseToken, async (req, res) => {
  const { amount } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR'
    });
    res.json(order);
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});
router.post('/verify', verifyFirebaseToken, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderItems,
    totalPrice
  } = req.body;
  console.log(req.body); // Log the incoming request body
 
  
  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    try {
      const newOrder = new Order({
        userFirebaseId: req.user.uid,
        orderItems,
        totalPrice,
        isPaid: true,
        paidAt: new Date()
      });
      console.log(`Expected Signature: ${expectedSignature}`);
      console.log(`Received Signature: ${razorpay_signature}`);
      await newOrder.save();
      res.status(200).json({ success: true, message: 'Order saved successfully' });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  } else {
    res.status(400).json({ success: false, message: 'Signature mismatch' });
  }
});

export default router;
