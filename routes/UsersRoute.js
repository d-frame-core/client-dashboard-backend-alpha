const express = require('express');
const router = express.Router();
const controller = require('../controllers/UsersController');


router.post("/login", controller.loginUser);
router.post("/signup", controller.signupUser);
router.get("/", controller.getUser);
router.get("/data/:id", controller.getUserbyid);
router.post("/", controller.postUser);
router.patch("/:id",controller.updateUser);
router.delete("/:id", controller.deleteUser);
router.get("/proctedRoute", controller.checkToken);

//admin
router.patch("/admin/:id",controller.adminUpdateUser);

module.exports = router;