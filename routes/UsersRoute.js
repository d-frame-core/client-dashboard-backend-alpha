const express = require('express');
const router = express.Router();
const controller = require('../controllers/UsersController');


router.post("/login", controller.loginUser);
router.post("/signup", controller.signupUser);
router.post("/", controller.postUser);
router.patch("/:id",controller.updateUser);
router.delete("/:id", controller.deleteUser);
router.get("/proctedRoute", controller.checkToken);
router.get("/data/:id", controller.getUserbyid);

//admin
router.patch("/admin/:id",controller.adminUpdateUser);
router.patch("/admin/updateStatus/:id",controller.toggleStatus);
router.get("/admin/getAllUsers", controller.getUser);
router.get("/admin/unverifiedAds", controller.getUnverifiedUser);

    
module.exports = router;