const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  token: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("admin", adminSchema);
