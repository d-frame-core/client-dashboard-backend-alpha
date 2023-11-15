// const cron = require('node-cron');
const { WebsiteData } = require('../models/websites.model'); // Import your Mongoose model
const {Tag} = require('../models/Tags');
// Define a function to update the status
const getAllWebsites = async (req, res) => {
  try {
    const websites = await WebsiteData.find();
    return res.json(websites);
  } catch (error) {
    console.error('Error getting all websites:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



const updateStatus = async () => {
  try {
    // Find records with visitorCounts greater than or equal to 500
    const result = await WebsiteData.updateMany(
        { visitorCounts: { $gte: 500 }, status: 'UNTAGGED' },
        { $set: { status: 'TAGGABLE' } }
      );

      console.log(`Updated ${result.nModified} documents.`);
  } catch (error) {
    console.error('Error updating status:', error);
  }
};

const addTagsToWebsite = async (req, res) => {
  const { websiteId, newTags } = req.body;

  if (!websiteId || !newTags || !Array.isArray(newTags)) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
    // Update the WebsiteData document
    const updatedWebsite = await WebsiteData.findOneAndUpdate(
      { _id: websiteId, status: { $ne: 'TAGGED' } },
      {
        $addToSet: { tags: { $each: newTags } },
        $set: { status: 'TAGGED' },
      },
      { new: true }
    );

    if (!updatedWebsite) {
      return res.status(404).json({ message: 'Website not found or already tagged' });
    }

    // Update the Tag documents
    await Promise.all(
      newTags.map(async (tag) => {
        await Tag.findOneAndUpdate(
          { name: tag },
          { $addToSet: { websites: websiteId } },
          { upsert: true }
        );
      })
    );

    return res.json(updatedWebsite);
  } catch (error) {
    console.error('Error adding tags:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateStatusToStopped = async (req, res) => {
  const { websiteId } = req.params;

  if (!websiteId) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
    const updatedWebsite = await WebsiteData.findOneAndUpdate(
      { _id: websiteId },
      { $set: { status: 'STOPPED' } }, // Set status to "STOPPED"
      { new: true }
    );

    if (!updatedWebsite) {
      return res.status(404).json({ message: 'Website not found' });
    }

    return res.json(updatedWebsite);
  } catch (error) {
    console.error('Error updating status to STOPPED:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const changeStatusToTagged = async (req, res) => {
    const { websiteId } = req.params;
  
    if (!websiteId) {
      return res.status(400).json({ message: 'Invalid request data' });
    }
  
    try {
      const updatedWebsite = await WebsiteData.findOneAndUpdate(
        { _id: websiteId, status: 'STOPPED' }, // Ensure status is "STOPPED" before updating
        { $set: { status: 'TAGGED' } }, // Set status to "TAGGED"
        { new: true }
      );
  
      if (!updatedWebsite) {
        return res.status(404).json({ message: 'Website not found or is not in "STOPPED" status' });
      }
  
      return res.json(updatedWebsite);
    } catch (error) {
      console.error('Error changing status to TAGGED:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
 
  const removeTagsFromWebsite = async (req, res) => {
    const { websiteId, tagsToRemove } = req.body;
  
    if (!websiteId || !tagsToRemove || !Array.isArray(tagsToRemove)) {
      return res.status(400).json({ message: 'Invalid request data' });
    }
  
    try {
      // Update the WebsiteData document
      const updatedWebsite = await WebsiteData.findOneAndUpdate(
        { _id: websiteId },
        { $pull: { tags: { $in: tagsToRemove } } },
        { new: true }
      );
  
      if (!updatedWebsite) {
        return res.status(404).json({ message: 'Website not found' });
      }
  
      // Update the Tag documents
      await Promise.all(
        tagsToRemove.map(async (tag) => {
          await Tag.findOneAndUpdate(
            { name: tag },
            { $pull: { websites: websiteId } },
            { new: true }
          );
        })
      );
  
      return res.json(updatedWebsite);
    } catch (error) {
      console.error('Error removing tags:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

const dataPool = async (req, res) => {
  try {
    const tags = await Tag.find().populate({
      path: 'websites',
      model: 'WebsiteData',
      select: 'website visitorCounts',
    });

    const result = tags.map((tag) => {
      const websites = tag.websites.map((website) => ({
        website: website.website,
        visitorCounts: website.visitorCounts,
      }));

      return {
        tag: tag.name,
        status: tag.status,
        websites,
        totalVisitors: websites.reduce((total, site) => total + site.visitorCounts, 0),
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Define a cron job to run every day at a specific time (e.g., midnight)
// cron.schedule('0 0 * * *', () => {
//   // Run the updateStatus function
//   updateStatus();
// });

  // Export the controller function
  module.exports = { dataPool, getAllWebsites, addTagsToWebsite, updateStatusToStopped, removeTagsFromWebsite, changeStatusToTagged };
