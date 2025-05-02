import mongoose from 'mongoose';
import Product from './models/Product.js';
import products from './datas/products.js'; // Importing the data

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://kanagalakshmimca16:ZoeqMTsthzSI3CuP@snapcartproducts.05pmugl.mongodb.net/snapcart?retryWrites=true&w=majority&appName=snapcartproducts')

    console.log('MongoDB connected1');
  } catch (error) {
    console.error('MongoDB connection failed', error);
    process.exit(1); // Exit the process with failure
  }
};

const seedProducts = async () => {
  try {
    // Deleting existing products in the database
    // await Product.deleteMany({});
    // console.log('Cleared existing products');

    // Insert new products into the database
    await Product.insertMany(products);
    console.log('Products inserted successfully');

    // Exit the process once done
    process.exit();
  } catch (error) {
    console.error('Error seeding products', error);
    process.exit(1);
  }
};

connectDB().then(seedProducts);
