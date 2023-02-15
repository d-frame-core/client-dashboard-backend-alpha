const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
        firstName: String,
        lastName: String,
        userName: String,
        email: String,
        phoneNumber: Number,
        tags:[]
});

module.exports = mongoose.model("User", userSchema);