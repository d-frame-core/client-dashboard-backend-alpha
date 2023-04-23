const express = require('express');
const router = express.Router();
const controller = require('../controllers/BidsController')

router.get("/", controller.getBids);
router.get("/:id", controller.getBid);
router.post("/", controller.postBid);
router.patch("/:id", controller.updateBid);
router.delete("/:id", controller.deleteBid);

module.exports = router;