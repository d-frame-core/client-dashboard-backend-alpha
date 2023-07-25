const jwt = require("jsonwebtoken");
const Token = require("../models/TokenModel");
require("dotenv").config();
const Admin = require("../models/AdminModel");
const bcrypt = require("bcryptjs");

// Generate JWT token
exports.generateToken = function (user) {
  const jwt = require("jsonwebtoken");
  require("dotenv").config();

  const payload = {
    userId: user.id,
    email: user.email,
  };

  const options = {
    expiresIn: "30d",
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, options);

  // Save the token to the database
  const newToken = new Token({
    userId: user.id,
    email: user.email,
    token,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  newToken.save((error) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Token saved successfully.");
    }
  });
  // console.log(newToken);

  return token;
};
// Refresh JWT token
exports.refreshToken = async function (token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = exports.generateToken({
      id: decoded.userId,
      email: decoded.email,
    });

    return newToken;
  } catch (err) {
    return null;
  }
};

// exports.register = async function ({ firstname, lastname, email, password }) {
//   try {
//     if (!(firstname && lastname && email && password)) {
//       res.status(400).json({ errMsg: "All fields are compulsory" });
//     }

//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       res.status(401).json({ errMsg: "Admin already exists with this email" });
//     }

//     const encryptedPassword = await bcrypt.hash(password, 10);

//     const admin = await Admin.create({
//       firstname,
//       lastname,
//       email,
//       password: encryptedPassword,
//     });

//     const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     admin.token = token;
//     admin.password = undefined;

//     res.status(201).json(admin);
//   } catch (error) {}
// };

// Verify JWT token
exports.verifyToken = function (token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
};
