import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  category: String,
  rating: { type: Number, default: 4.5 }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
