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



// import mongoose from 'mongoose';

// const cartItemSchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product', // <-- This is the key line
//     required: true
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     default: 1
//   }
// });

// const cartSchema = new mongoose.Schema({
//   userId: {
//     type: String,
//     required: true
//   },
//   items: [cartItemSchema],
//   isPaid: {
//     type: Boolean,
//     default: false
//   },
//   paidAt: {
//     type: Date
//   }
// });

// const Cart = mongoose.model('Cart', cartSchema);

// export default Cart;
