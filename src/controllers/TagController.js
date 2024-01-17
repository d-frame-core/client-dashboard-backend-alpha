/** @format */

// Import the Tag model
const { Tag } = require('../models/Tags');

// Controller to create a new tag
const createTag = async (req, res) => {
  try {
    // Get tag data from the request body
    const name = req.body.tagData;

    // Create a new tag
    const tag = new Tag({
      name: name,
      status: 'ACTIVE',
      websites: [],
    });
    await tag.save();

    res.status(201).json({ message: 'Tag created successfully', tag });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating tag' });
  }
};

const getTagById = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all tags
const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();

    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getActiveTags = async (req, res) => {
  try {
    const activeTags = await Tag.find({ status: 'active' });

    res.status(200).json(activeTags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const editTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const changeTagStatus = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // Toggle the status between 'active' and 'inactive'
    tag.status = tag.status.toUpperCase() === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await tag.save();

    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createTag,
  getTagById,
  getAllTags,
  editTag,
  changeTagStatus,
  getActiveTags,
};
