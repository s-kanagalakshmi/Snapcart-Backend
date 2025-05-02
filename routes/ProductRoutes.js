import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Add new product (you can use Postman or a form to call this)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/products', async (req, res) => {
  try {
    const products1 = await Product.find(); // Fetch all products from DB
    res.json(products1); // Send products as JSON response
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});
// Get products by category
router.get('/category/:categoryName', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryName });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});


export default router;
