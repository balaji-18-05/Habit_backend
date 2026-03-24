// Workaround: Node.js 20 TLS incompatibility with MongoDB Atlas
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Don't call process.exit() — it kills Vercel serverless functions
    throw error;
  }
};

module.exports = connectDB;
