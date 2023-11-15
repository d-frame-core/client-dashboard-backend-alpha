const mongoose = require('mongoose');

const HelpSchema = new mongoose.Schema({
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

const Help = mongoose.model('Help', HelpSchema);

module.exports = Help;
 
