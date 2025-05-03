import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
      }
    }
  ]
}, {
  timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
