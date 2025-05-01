import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: String,
  category: String,
  price: { type: Number, required: true },
  imageUrl: String,
  stock: { type: Number, default: 0 },
  description: String
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
