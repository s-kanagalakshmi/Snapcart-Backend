// routes/userRoutes.js
import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

    await user.save();
    res.status(201).json(user); // returns _id
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
