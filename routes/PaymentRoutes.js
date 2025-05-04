import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
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
 console.log(verifyFirebaseToken,"verify")
  
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
      console.log(newOrder,"neworder")
      await newOrder.save();
      res.status(200).json({ success: true, message: 'Order saved successfully' });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  } else {
    res.status(400).json({ success: false, message: 'Signature mismatch' });
  }
});
router.post('/verify-cart', verifyFirebaseToken, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    totalPrice
  } = req.body;

  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    try {
      // ✅ Find the user's cart
      const cart = await Cart.findOne({ userId: req.user.uid }).populate({ path:'items.productId', strictPopulate: false });


console.log(cart,"cart1")
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found or empty' });
      }

      // Optionally you can mark the cart as paid, archive it, or log the purchase
      const cartData = {
        userId: cart.userId,
        items: cart.items,
        totalPrice,
        razorpay_order_id,
        razorpay_payment_id,
        isPaid: true,
        paidAt: new Date()
      };

      console.log(`Verified Cart Payment for: ${cart.userId}`);
      console.log('Cart Items:', cart.items);
      console.log('Cart Data:', cartData);

      // You can either save this to another collection (like Orders) or update Cart
      await Cart.updateOne({ _id: cart._id }, { $set: { isPaid: true, paidAt: new Date() } });

      res.status(200).json({ success: true, message: 'Cart payment verified and updated successfully' });

    } catch (err) {
      console.error('Error verifying cart payment:', err);
      res.status(400).json({ success: false, error: err.message });
    }
  } else {
    res.status(400).json({ success: false, message: 'Signature mismatch' });
  }
});

// router.post('/verify', verifyFirebaseToken, async (req, res) => {
//   const {
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature,
//     totalPrice
//   } = req.body;

//   const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//     .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//     .digest('hex');

//   if (expectedSignature === razorpay_signature) {
//     try {
//       // 🔸 1. Fetch the user's cart
//       const userCart = await Cart.findOne({ userId: req.user.uid }).populate('items.productId');

//       if (!userCart || userCart.items.length === 0) {
//         return res.status(400).json({ success: false, message: 'Cart is empty or not found' });
//       }

//       // 🔸 2. Transform cart items to orderItems format
//       const orderItems = userCart.items.map(item => ({
//         product: item.productId._id,
//         name: item.productId.name,
//         price: item.productId.price,
//         quantity: item.quantity
//       }));

//       // 🔸 3. Create new order
//       const newOrder = new Order({
//         userFirebaseId: req.user.uid,
//         orderItems,
//         totalPrice,
//         isPaid: true,
//         paidAt: new Date()
//       });

//       await newOrder.save();

//       // 🔸 4. Clear the cart
//       await Cart.findOneAndDelete({ userId: req.user.uid });

//       res.status(200).json({ success: true, message: 'Order saved and cart cleared successfully' });

//     } catch (err) {
//       console.error('Error verifying and saving order:', err);
//       res.status(500).json({ success: false, error: err.message });
//     }
//   } else {
//     res.status(400).json({ success: false, message: 'Signature mismatch' });
//   }
// });

export default router;
