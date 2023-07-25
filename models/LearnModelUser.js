const mongoose = require('mongoose');

const LearnMoreSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  pdf: {
    type: String,  // store the path or URL of the uploaded PDF file
  }
});

const LearnUser = mongoose.model('LearnUser', LearnMoreSchema);

module.exports = LearnUser;
