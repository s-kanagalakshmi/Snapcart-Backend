import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalPrice: {
    type: Number,
    required: true
  },
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
