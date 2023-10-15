const express = require('express');
const path = require('path'); // Import the path module
const router = express.Router();

// Convert the relative path to an absolute path
const controller = require(path.join(__dirname, '..', 'controllers', 'BidsController'));

router.get("/", controller.getBids);
router.get("/:id", controller.getBid);
router.post("/", controller.postBid);
router.patch("/:id", controller.updateBid);
router.delete("/:id", controller.deleteBid);

module.exports = router;