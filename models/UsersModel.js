const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  userId:  Number,
  companyName:   { type: String, required: true },
  companyType:   String, 
  companyEmail:   { type: String, required: true },
  companyAddress1:  String, 
  companyAddress2:  String, 
  status : { type: String, default: "unverified" },//unverified,verified,paused,stopped
  walletAddress:  { type: String, required: true }, 
  jwtSession:  String,
  jwtExpire:  Date,
  tags: []
});

module.exports = mongoose.model("User", userSchema);
