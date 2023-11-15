const mongoose = require('mongoose');

const LearnSchema = new mongoose.Schema({
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

const LearnMore = mongoose.model('LearnMore', LearnSchema);

module.exports = LearnMore;
