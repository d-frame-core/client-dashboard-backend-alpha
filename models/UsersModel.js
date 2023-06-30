const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  userId:  Number,
  companyName:   { type: String, required: true },
  companyType:   String, 
  companyEmail:   { type: String, required: true },
  companyAddress1:  String, 
  companyAddress2:  String, 
  status : String,
  walletAddress:  { type: String, required: true }, 
  jwtSession:  String,
  jwtExpire:  Date,
  tags: []
});

module.exports = mongoose.model("User", userSchema);
