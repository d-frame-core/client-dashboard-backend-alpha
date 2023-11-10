const express = require('express');
const router = express.Router();
const tagController = require('../controllers/TagController');

// Create a new tag
router.post('/admin/createTag', tagController.createTag);

// Get a single tag by ID
router.get('/admin/singleTag/:id', tagController.getTagById);

// Get all tags
router.get('/admin/getAll', tagController.getAllTags);

// Get all active tags
router.get('/admin/getAllActive', tagController.getActiveTags);

// Edit a tag by ID
router.put('/admin/editTag/:id', tagController.editTag);

// Change the status of a tag by ID
router.put('/admin/statusChange/:id', tagController.changeTagStatus);

module.exports = router;
