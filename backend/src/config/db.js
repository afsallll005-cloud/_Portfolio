const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  // If already connected, reuse existing connection
  if (isConnected && mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Only exit process in local non-production environment, never in serverless
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;

