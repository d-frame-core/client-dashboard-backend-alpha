/** @format */

const express = require('express');
const router = express.Router();
const websiteController = require('../controllers/WebsiteController'); // replace 'yourController' with the actual name of your controller file

// Define your routes

router.get('/admin/getAllWebsites', websiteController.getAllWebsites);

router.get(
  '/admin/get-500-sites',
  websiteController.getWebsitesWithCountGreaterThan500
);

router.get('/admin/dataPool', websiteController.dataPool);
// Route to add tags to a website
router.post(
  '/admin/addTags/:websiteId',
  websiteController.addSingleTagToWebsite
);

// Route to update the status to STOPPED
router.put(
  '/admin/updateStatusToStopped/:websiteId',
  websiteController.updateStatusToStopped
);

// Route to remove tags from a website
router.put(
  '/admin/removeTags/:websiteId',
  websiteController.removeTagsFromWebsite
);

// Route to change status to TAGGED
router.put(
  '/admin/changeStatusToTagged/:websiteId',
  websiteController.changeStatusToTagged
);

// More routes can be added as needed

module.exports = router;
