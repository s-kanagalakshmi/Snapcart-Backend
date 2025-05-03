import express from 'express';
import Cart from '../models/Cart.js';
import { verifyFirebaseToken } from '../middleware/firebaseAuth.js';

// import authMiddleware from '../middleware/firebaseAuth.js'; // Protect route
const router = express.Router();

// Save or update cart
router.post('/save', verifyFirebaseToken, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.uid;
  if (!productId || !quantity) {
    return res.status(400).json({ error: 'Missing productId or quantity' });
  }
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, products: [{ productId, quantity }] });
  } else {
    const existing = cart.products.find(p => p.productId === productId);
    if (existing) existing.quantity += quantity;
    else cart.products.push({ productId, quantity });
  }

  await cart.save();
  res.json({ success: true, cart });
});
router.post('/remove', verifyFirebaseToken, async (req, res) => {
    const { productId } = req.body;
    try {
      const cart = await Cart.findOne({ userId: req.user.uid });
      if (!cart) return res.status(404).json({ error: 'Cart not found' });
  
      cart.products = cart.products.filter(p => p.productId.toString() !== productId);
      await cart.save();
  
      await cart.populate('products.productId');
      res.json({ cart: cart.products });
    } catch (err) {
      console.error('Error removing product:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
// Get cart
// router.get('/',verifyFirebaseToken, async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ userId: req.user.uid }).populate('items.productId');
//     res.json({ success: true, cart });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });
router.get('/', verifyFirebaseToken, async (req, res) => {
    try {
      const userId = req.user.uid;
  
      const cartDoc = await Cart.findOne({ userId }).populate('products.productId');
  
      if (!cartDoc) return res.json([]); // return empty cart
  
      const populatedCart = cartDoc.products.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));
  
      res.json(populatedCart);
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
export default router;
