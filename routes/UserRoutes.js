import express from 'express';
import User from '../models/User.js';
import { verifyFirebaseToken } from '../middleware/firebaseAuth.js';

const router = express.Router();

// Create or get user
router.post('/firebase-login', verifyFirebaseToken, async (req, res) => {
  try {
    // console.log('req.firebaseUser:', req.firebaseUser); // <== Add this
    const { uid, email, name } = req.user;

    // const { uid, email, name } = req.firebaseUser; // Check this line

    let user = await User.findOne({ firebaseUID: uid });

    if (!user) {
      user = new User({ firebaseUID: uid, email, name });
      await user.save();
    }

    res.json({ message: 'User authenticated', user });
  } catch (error) {
    console.error('User save error:', error); // <== Log full error
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;
