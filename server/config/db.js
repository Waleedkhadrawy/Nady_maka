const mongoose = require('mongoose');

async function connectDB(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is not defined. Please set it in .env');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = { connectDB };