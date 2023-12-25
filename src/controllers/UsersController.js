/** @format */

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path'); // Import the path module

const User = require(path.join(__dirname, '..', 'models', 'UsersModel'));
const AdsModel = require(path.join(__dirname, '..', 'models', 'AdsModel'));
require('dotenv').config();
const nodemailer = require('nodemailer');

//Get all detail
const getUser = async (req, res) => {
  try {
    const foundUser = await User.find();
    if (foundUser) {
      res.status(200).json(foundUser);
    } else {
      res.status(200).json('No User Found');
    }
  } catch (err) {
    res.status(500).json({ message: 'Error Occured' });
  }
};

const getUnverifiedUser = async (req, res) => {
  try {
    const activeUsers = await User.find({ status: 'unverified' });

    if (activeUsers.length > 0) {
      res.status(200).json(activeUsers);
    } else {
      res.status(404).json({ message: 'No active users found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
};

const { Storage } = require('@google-cloud/storage');

// Set up Google Cloud Storage
const storageClient = new Storage({
  keyFilename: path.join(__dirname, '..', '..', 'key.json'),
  projectId: 'scenic-sunspot-391708',
});
const bucketName = 'dframe-static-bucket';
const postProfileImage = async (req, res) => {
  try {
    const clientId = req.params.id;
    const user = await User.findById(clientId);
    if (req.file) {
      if (req.file.buffer) {
        const bucket = storageClient.bucket(bucketName);
        const filename = `${clientId}-profileImage-${Date.now()}-${req.file.originalname.replace(
          / /g,
          '_'
        )}`;
        const file = bucket.file(filename);
        const blobStream = file.createWriteStream();
        console.log('file stream entered');
        blobStream.on('error', (err) => {
          console.log('error in gcp', err);
          return res
            .status(500)
            .json({ error: 'Error uploading image to GCS' });
        });

        blobStream.on('finish', async () => {
          // Set the user's profileImage field to the GCS image URL
          // user.profileImage = `https://storage.cloud.google.com/${bucketName}/${filename}?authuser=2`;
          user.profileImage = user.profileImage || '';
          user.profileImage = `https://storage.googleapis.com/${bucketName}/${filename}`;

          // Save the updated user document
          const savedUser = await user.save();
          console.log('saved user', savedUser);
          res.status(200).json({
            message: 'Image uploaded successfully',
            imageUrl: user.profileImage,
          });
        });
        console.log(req.file.buffer);
        blobStream.end(req.file.buffer);
      } else {
        console.log('REQ.FILE.Buffer NOT EXISTS');
      }
    } else {
      return res.status(404).json({ message: 'NO FILE RECEIVED' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'INTERNAL Error occurred' });
  }
};
//Get detail by id
const getUserbyid = (req, res) => {
  const clientId = req.params.id;
  User.findById(clientId)
    .then((foundUser) => {
      if (foundUser) {
        res.status(200).json(foundUser);
      } else {
        res.status(200).json('No User Found');
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error Occured' });
    });
};

const postUser = async (req, res) => {
  console.log(req.body);
  const newUser = new User({
    userId: req.body.userId,
    companyName: req.body.companyName,
    companyType: req.body.companyType,
    companyEmail: req.body.companyEmail,
    companyAddress1: req.body.companyAddress1,
    companyAddress2: req.body.companyAddress2,
    walletAddress: req.body.walletAddress,
    status: req.body.status,
  });
  try {
    const savedUser = await newUser.save();
    console.log(savedUser);

    res
      .status(201)
      .json({ message: 'Post created successfully', id: savedUser._id });
  } catch (err) {
    res.status(500).json(err);
  }
};

const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params; // Extract the userId from request parameters
    const { newStatus } = req.body; // Extract the newStatus from request body

    // Find the user by userId
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the status field with the newStatus
    user.status = newStatus;

    // Save the updated user document
    await user.save(); // Use save() instead of findByIdAndUpdate

    return res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error toggling status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUser = async (req, res) => {
  console.log('data received', req.body);
  try {
    const userId = req.params.id;

    // Fetch the user by ID
    const user = await User.findById(userId);

    if (!user) {
      console.log('user not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user fields with the request body
    console.log('user found');
    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Updated Successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error Occurred', error: err.message });
  }
};

const deleteUser = (req, res) => {
  try {
    User.deleteOne({ userId: req.params.id }, (err) => {
      if (!err) {
        res.status(200).json('Deleted Successfully');
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'ERROR Occured', error: err });
  }
};

const loginUser = async (req, res) => {
  const walletAddress = req.body.walletAddress;
  try {
    const user = await User.findOne({ walletAddress });
    if (user) {
      const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });
      res
        .status(200)
        .json({ message: 'user exist,login successfully', user, token });
    } else {
      res
        .status(201)
        .json({ message: 'No address found please Signup', walletAddress });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error Occured' });
  }
};

const checkToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(403).json({ message: 'session timeout,please login again' });
      } else {
        req.user = decodedToken;
        // Add a welcome message to the response if the token is valid
        res.status(200).json({ message: 'Welcome to protected routes' });
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'Missing authorization header' });
  }
};

const signupUser = async (req, res) => {
  const walletAddress = req.body.walletAddress;
  try {
    const user = await User.findOne({ walletAddress });
    if (user) {
      res
        .status(200)
        .json({ message: 'Address already exists. Login instead.' });
    } else {
      const newUser = new User({
        companyName: req.body.companyName,
        companyType: req.body.companyType,
        companyEmail: req.body.companyEmail,
        companyAddress1: req.body.companyAddress1,
        companyAddress2: req.body.companyAddress2,
        walletAddress: req.body.walletAddress,
      });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'dframe.org@gmail.com',
          pass: process.env.pass,
        },
      });

      const mailOptions = {
        from: 'dframe.org@gmail.com',
        to: req.body.companyEmail,
        subject: 'Welcome to D Frame 😄',
        text: `You have been registered to D Frame Client Dashboard successfully. \n Hope you enjoy our platform. \n For feedback and suggestions, please contact us at <dframe.org@gmail.com>`,
      };

      await transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: 'Email failed' });
        }
        const savedUser = await newUser.save();

        res.status(201).json({
          message: 'Signup successful',
          user: savedUser,
        });
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'error occur' });
  }
};

const adminUpdateUser = (req, res) => {
  try {
    User.updateOne(
      { _id: req.params.id },
      { $set: { Status: req.body.status } },
      (err) => {
        if (!err) {
          res.status(200).json({ message: 'Updated Successfully' });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Error Occures', error: err });
  }
};

module.exports = {
  getUser,
  getUserbyid,
  postUser,
  updateUser,
  deleteUser,
  loginUser,
  checkToken,
  signupUser,
  adminUpdateUser,
  toggleStatus,
  getUnverifiedUser,
  postProfileImage,
};
