const mongoose = require('mongoose');

const HelpUserSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

const HelpUser = mongoose.model('HelpUser', HelpUserSchema);
module.exports = HelpUser; 