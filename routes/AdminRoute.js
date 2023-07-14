const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");
const Admin = require("../models/AdminModel");
const { updateMany } = require("../models/TokenModel");

// Generate JWT token route
router.post("/generateAdminToken", function (req, res) {
  const token = authController.generateToken(req.body.user);
  res.json({ token });
});

router.post("/register", async function (req, res) {
  try {
    const { firstname, lastname, email, password } = req.body;
    if (!(firstname && lastname && email && password)) {
      res.status(400).json({ errMsg: "All fields are compulsory" });
    }
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      res.status(401).json({ errMsg: "User already exists with this email" });
    }
  } catch (error) {}
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

// sign up
// const User = require('./models/User');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// app.post('/signup', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ email, password: hashedPassword });
//     await user.save();

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id }, 'your_secret_key');
//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.post('/login', async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       const user = await User.findOne({ email });

//       if (!user) {
//         return res.status(401).json({ error: 'Invalid email or password' });
//       }

//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         return res.status(401).json({ error: 'Invalid email or password' });
//       }

//       // Generate JWT token
//       const token = jwt.sign({ userId: user._id }, 'your_secret_key');
//       res.json({ token });
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });

// function verifyEmail(req, res, next) {
//     const token = req.header('Authorization');
//     if (!token) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     try {
//       const decodedToken = jwt.verify(token, 'your_secret_key');
//       req.userId = decodedToken.userId;
//       next();
//     } catch (error) {
//       res.status(401).json({ error: 'Invalid token' });
//     }
//   }

// app.post('/logout', (req, res) => {
//     // No special logic needed for logout, as JWT tokens are stateless
//     res.json({ message: 'Logged out successfully' });
//   });

//   // 6. Forgot Password Route
//   app.post('/forgot-password', async (req, res) => {
//     try {
//       const { email } = req.body;
//       const user = await User.findOne({ email });

//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       // Generate a password reset token and send it via email
//       const resetToken = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });

//       // Send the reset token via email (using nodemailer or any other email service)

//       res.json({ message: 'Password reset token sent to your email' });
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });

//   // 7. Change Password Route
//   app.post('/change-password', verifyEmail, async (req, res) => {
//     try {
//       const { newPassword } = req.body;
//       const user = await User.findById(req.userId);

//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       // Update the user's password
//       const hashedPassword = await bcrypt.hash(newPassword, 10);
//       user.password = hashedPassword;
//       await user.save();

//       res.json({ message: 'Password changed successfully' });
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });

// app.get('/verify-email/:token', async (req, res) => {
//     try {
//       const token = req.params.token;
//       const decodedToken = jwt.verify(token, 'your_secret_key');

//       const user = await User.findById(decodedToken.userId);

//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       if (user.verified) {
//         return res.json({ message: 'Email already verified' });
//       }

//       user.verified = true;
//       await user.save();

//       res.json({ message: 'Email verified successfully' });
//     } catch (error) {
//       res.status(401).json({ error: 'Invalid or expired token' });
//     }
//   });
module.exports = router;
