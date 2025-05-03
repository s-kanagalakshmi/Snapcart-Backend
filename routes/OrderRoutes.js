import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  userFirebaseId: {
    type: String,
    required: true
  },
  orderItems: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
