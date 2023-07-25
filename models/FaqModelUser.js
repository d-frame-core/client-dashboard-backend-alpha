const mongoose = require('mongoose');

// Define schema for the FAQ data to be stored
const FaqUserSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

// Create a model using the schema
const FaqUser = mongoose.model('FaqUser', FaqUserSchema);

module.exports = FaqUser;
 