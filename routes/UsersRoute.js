const express = require('express');
const router = express.Router();
const controller = require('../controllers/UsersController');


router.post("/login", controller.loginUser);
router.post("/signup", controller.signupUser);
router.post("/", controller.postUser);
router.patch("/:id",controller.updateUser);
router.delete("/:id", controller.deleteUser);
router.get("/proctedRoute", controller.checkToken);

//admin
router.patch("/admin/:id",controller.adminUpdateUser);
router.get("/admin/getAllUsers", controller.getUser);
router.get("/data/:id", controller.getUserbyid);


module.exports = router;