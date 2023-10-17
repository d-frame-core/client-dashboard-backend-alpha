/** @format */

const express = require('express');
const path = require('path'); // Import the path module
const router = express.Router();
const multer = require('multer');

// Convert the relative path to an absolute path
const controller = require(path.join(
  __dirname,
  '..',
  'controllers',
  'UsersController'
));
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/login', controller.loginUser);
router.post('/signup', controller.signupUser);
router.post('/', controller.postUser);
router.patch('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);
router.get('/proctedRoute', controller.checkToken);
router.get('/data/:id', controller.getUserbyid);
router.patch('/image/:id', upload.single('image'), controller.postProfileImage);
//admin
router.patch('/admin/:id', controller.adminUpdateUser);
router.patch('/admin/updateStatus/:id', controller.toggleStatus);
router.get('/admin/getAllUsers', controller.getUser);
router.get('/admin/unverifiedAds', controller.getUnverifiedUser);

module.exports = router;
