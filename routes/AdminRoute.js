const express = require("express");
const path = require("path"); // Import the path module
const router = express.Router();

// Convert relative paths to absolute paths
// const authController = require(path.join(__dirname, "..", "controllers", "AuthController"));
const Admin = require(path.join(__dirname, "..", "models", "AdminModel"));
const bcrypt = require("bcryptjs");
const { updateMany } = require(path.join(__dirname, "..", "models", "TokenModel"));
const jwt = require("jsonwebtoken");
const adminController = require(path.join(__dirname, "..", "controllers", "AuthController"));


// Generate JWT token route
// router.post("/generateAdminToken", function (req, res) {
//   const token = authController.generateToken(req.body.admin);
//   res.json({ token });
// });

// Login the Admin
router.post("/login", async function (req, res) {
  try {
    // take all data from the form
    const { email, password, phoneNumber } = req.body;

    // all the data should exist
    if (!(email && password && phoneNumber)) {
      res.status(400).json("All fields are compulsory");
    }

    // check if admin exists & match password
    const admin = await Admin.findOne({ email });
    const checkNumber = admin.phoneNumber == phoneNumber;
    const checkPassword = await bcrypt.compare(password, admin.password);
    if (!(admin && checkPassword && checkNumber)) {
      // If no admin is found or password doesn't match, send an error response
      res.status(400).json("Invalid email or password or phone number");
      return; // Exit the function early to avoid further processing
    }

    // Admin found and password matched, proceed with generating token and setting cookie
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    admin.token = token;
    admin.password = undefined;

    // cookie section
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(200).cookie("token", token, options).json({
      success: true,
      token,
      admin,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout", function (req, res) {
  res.status(200).clearCookie("token").json("Logged out successfully: ");
});

router.post("/adminLogin", adminController.adminLogin);


module.exports = router;
