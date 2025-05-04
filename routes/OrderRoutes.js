import mongoose from 'mongoose';
import Order from '../models/Order.js';
import express from 'express';

// const orderItemSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   qty: { type: Number, required: true },
//   price: { type: Number, required: true },
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true
//   }
// });

// const orderSchema = new mongoose.Schema({
//   userFirebaseId: {
//     type: String,
//     required: true
//   },
//   orderItems: [orderItemSchema],
//   totalPrice: { type: Number, required: true },
//   isPaid: { type: Boolean, default: false },
//   paidAt: { type: Date }
// }, { timestamps: true });

// const Order = mongoose.model('Order', orderSchema);
// export default Order;
// const orderSchema = new mongoose.Schema({
//   userFirebaseId: {
//     type: String,
//     required: true
//   },
//   orderItems: [
//     {
//       product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product',
//         required: true
//       },
//       name: { type: String, required: true },
//       qty: { type: Number, required: true },
//       price: { type: Number, required: true }
//     }
//   ],
//   totalPrice: {
//     type: Number,
//     required: true
//   },
//   isPaid: {
//     type: Boolean,
//     default: false
//   },
//   paidAt: Date
// }, { timestamps: true });
// const Order = mongoose.model('Order', orderSchema);
// export default Order;
const router = express.Router();

router.get('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    console.log(uid,"uid")
    const orders = await Order.find({ userFirebaseId: uid });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});
export default router;
