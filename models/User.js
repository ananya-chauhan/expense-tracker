const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    unique: true,
  },
  transactions: {
    type: [transactionSchema],    
    default: [],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
