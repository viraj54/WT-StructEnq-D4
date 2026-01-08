const mongoose = require('mongoose');

const connectDB = async () => {
  const connStr = process.env.MONGO_URI || 'mongodb://localhost:27017/microfinance';
  
  const connectWithRetry = async () => {
    try {
      const conn = await mongoose.connect(connStr);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      console.log('Retrying MongoDB connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    }
  };

  await connectWithRetry();
};

module.exports = connectDB;
