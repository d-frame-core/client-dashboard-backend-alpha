/** @format */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: Number,
  profileImage: { type: String, default: '' },
  companyName: { type: String, required: true },
  companyType: String,
  companyEmail: { type: String, required: true },
  companyAddress1: String,
  companyAddress2: String,
  status: { type: String, default: 'UNVERIFIED' }, //unverified,verified,paused,stopped
  walletAddress: { type: String, required: true },
  jwtSession: String,
  jwtExpire: Date,
  tags: [],
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction', // Reference to the Transaction model
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
