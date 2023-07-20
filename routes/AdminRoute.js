const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");
const Admin = require("../models/AdminModel");
const bcrypt = require("bcryptjs");
const { updateMany } = require("../models/TokenModel");
const jwt = require("jsonwebtoken");

// Generate JWT token route
router.post("/generateAdminToken", function (req, res) {
  const token = authController.generateToken(req.body.user);
  res.json({ token });
});

// Register the admin
router.post("/register", async function (req, res) {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!(firstname && lastname && email && password)) {
      res.status(400).json({ errMsg: "All fields are compulsory" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      res.status(401).json({ errMsg: "Admin already exists with this email" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      firstname,
      lastname,
      email,
      password: encryptedPassword,
    });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    admin.token = token;
    admin.password = undefined;

    res.status(201).json(admin);
  } catch (error) {}
});

// Login the admin
router.post("/login", async function (req, res) {
  const { email, password } = req.body;

  if (email && password) {
    res.status(400).json({ errMsg: "All fields are compulsory" });
  }

  const admin = await Admin.findOne({ email });
  if (!admin) {
    res.status(400).json({ errMsg: "Admin not found" });
  }

  await bcrypt.compare(password, admin.password);
});

// Refresh JWT token route
router.post("/refreshAdminToken", function (req, res) {
  authController
    .refreshToken(req.headers.token)
    .then((newToken) => {
      if (!newToken) {
        return res.status(401).json({ error: "Invalid token" });
      }
      //console.log(newToken)
      res.json({ token: newToken });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    });
});

// Verify JWT token route
router.post("/verifyAdminToken", function (req, res) {
  const decoded = authController.verifyToken(req.headers.token);
  if (!decoded) {
    return res.status(401).json({ error: "Invalid token" });
  }
  res.json({ decoded });
});

// Protected route
router.get("/protectedAdminRoute", function (req, res) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Token is not provided." });
  }
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  const decoded = authController.verifyToken(token);
  if (!decoded) {
    return res
      .status(401)
      .json({ error: "Session expired. Please log in again." });
  }

  const result = authController.refreshToken(token);
  if (result.error) {
    return res.status(401).json({ error: result.error });
  }

  res.set("Authorization", `Bearer ${result.token}`);
  res.json({ message: "Welcome to the protected route!" });
});

module.exports = router;
