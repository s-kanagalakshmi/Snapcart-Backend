import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
    }
  ],
  totalPrice: Number,
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
