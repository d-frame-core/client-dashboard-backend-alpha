const express = require('express');
const router = express.Router();
const controller = require('../controllers/DframeUsersController');


router.patch("/:id",controller.updateUser);
router.delete("/:id", controller.deleteUser);

//admin
router.patch("/admin/:id",controller.adminUpdateUser);
router.get("/admin/getAllUsers", controller.getUser);
router.get("/data/:id", controller.getUserbyid);


module.exports = router;