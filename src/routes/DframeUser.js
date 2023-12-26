/** @format */

const express = require('express');
const path = require('path'); // Import the path module
const { sendTokens } = require('../controllers/DframeUsersController');
const router = express.Router();

// Convert the relative path to an absolute path
const controller = require(path.join(
  __dirname,
  '..',
  'controllers',
  'DframeUsersController'
));

router.patch('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);

//admin
router.patch('/admin/:id', controller.adminUpdateUser);
router.get('/admin/getAllUsers', controller.getUser);
router.get('/data/:id', controller.getUserbyid);
router.post('/admin/reward', sendTokens);

module.exports = router;
