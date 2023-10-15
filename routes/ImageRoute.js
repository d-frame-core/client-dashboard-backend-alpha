
const express = require('express');
const multer = require('multer');
const path = require('path'); // Import the path module
const router = express.Router();

// Convert the relative path to an absolute path
const profileController = require(path.join(__dirname, '..', 'controllers', 'ImageController'));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = function (req, file, cb) {
  // Accept only image files
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter,limits:{fieldSize: 25 * 1024 * 1024} });

router.post('/uploadProfilePicture', upload.single('image'),  profileController.uploadProfilePicture);
// Route to get a profile picture by its ID
router.get("/:id", profileController.getProfilePictureById);
//get all image
router.get("/profile/pictures", profileController.getAllProfilePictures);
// Route to update a profile picture by its ID
router.put( "/:id",upload.single("image"), profileController.updateProfilePicture);

// Route to delete a profile picture by its ID
router.delete("/:id", profileController.deleteProfilePicture);



module.exports = router;
