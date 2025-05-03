import express from 'express';
import mongoose from 'mongoose';
// import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/UserRoutes.js';
import orderRoutes from './routes/OrderRoutes.js';
import productRoutes from './routes/ProductRoutes.js';
import cartRoutes from './routes/CartRoutes.js'
import paymentRoute from './routes/PaymentRoutes.js';

// dotenv.config(); // Load environment variables first


const app = express(); 

app.use(cors());
app.use(express.json());
mongoose.connect('mongodb+srv://kanagalakshmimca16:ZoeqMTsthzSI3CuP@snapcartproducts.05pmugl.mongodb.net/snapcart?retryWrites=true&w=majority&appName=snapcartproducts')
.then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));


  
// Route middleware
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/payment', paymentRoute);
app.use('/cart', cartRoutes);

// app.use('/api', uploadRoute);

// Root route
app.get('/', (req, res) => {
  res.send('Snapcart API running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
