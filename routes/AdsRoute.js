const express = require('express');
const router = express.Router();
const controller = require('../controllers/AdsController')

router.get("/:id", controller.getAd);
router.get("/clientAllAds/:id", controller.getAllClientDetails );
router.post("/", controller.upload.single('image'), controller.postAd);
router.patch("/:id", controller.updateAd);
router.patch("/admin/:id", controller.updateAd);
router.delete("/:id", controller.deleteAd);

//admin
router.patch("/admin/:id", controller.adminUpdateAd);
router.get("/getAllCampaigns", controller.getAllAd);


module.exports = router;