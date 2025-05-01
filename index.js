import express from 'express';
import mongoose from 'mongoose';
// import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/UserRoutes.js';
import orderRoutes from './routes/OrderRoutes.js';
// import productRoutes from './routes/ProductRoutes.js';


// dotenv.config(); // Load environment variables first

const app = express(); 

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Route middleware
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Snapcart API running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
