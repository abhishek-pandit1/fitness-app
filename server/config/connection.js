require('dotenv').config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const MONGODB_URI = process.env.MONGODB_URI;

// Debug log to check if URI is being read correctly
console.log('MongoDB URI:', MONGODB_URI ? 'URI exists' : 'URI is missing');

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

// Add connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

console.log('Attempting to connect to MongoDB...');

mongoose.connect(MONGODB_URI, options)
.then(() => {
  console.log('Successfully connected to MongoDB!');
  console.log('Database:', mongoose.connection.name);
  console.log('Host:', mongoose.connection.host);
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    code: err.code
  });
  process.exit(1);
});

// Add connection event listeners
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

module.exports = mongoose.connection;
