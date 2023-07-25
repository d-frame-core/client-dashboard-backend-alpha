const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		firstName: {type: String, required: false},
		lastName: {type: String, required: false},
		name: {type: String},
		userName : {type: String},
		phoneNumber: {type: String},
		address: {type: String},
		email: {type: String, required: true},
		isActive: {type: Boolean, required: true},
		isEmailVerified: {type: Boolean, default: false},
		publicAddress: {type: String,required: true, unique: true},
		earnings: {type: String, required: true},
	}
);


const User = mongoose.model('DUser', userSchema);

module.exports = User;