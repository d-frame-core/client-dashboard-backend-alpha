const express = require('express');
const path = require('path'); // Import the path module
const router = express.Router();

// Convert the relative paths to absolute paths
const LearnMoreController = require(path.join(__dirname, '..', 'controllers', 'LearnmoreController'));
const UserLearnmoreController = require(path.join(__dirname, '..', 'controllers', 'UserLearnmoreController'));


router.get('/readLearnMore/',  LearnMoreController.getAllLearnMore);
router.post('/addLearnMore/', LearnMoreController.createLearnMore);
router.post('/addSingleLearn/', LearnMoreController.createSingleLearn);
router.get('/learnMore/:id', LearnMoreController.getLearnMoreById);
//for admin
router.put('/admin/update/:id', LearnMoreController.updateLearnMore );
router.delete('/admin/delete', LearnMoreController.delete);
router.delete('/admin/deleteSingle/:id', LearnMoreController.deleteSingle);


//user Routes
router.get('/userLearn/getAllLearn',  UserLearnmoreController.getAllLearnUser); 
router.post('/userLearn/addAllLearn',  UserLearnmoreController.createLearnUser);
router.post('/userLearn/addLearn',  UserLearnmoreController.createSingleLearnUser);
router.put('/userLearn/update/:id',UserLearnmoreController.updateLearnUser);
router.delete('/userLearn/deleteAll', UserLearnmoreController.deleteLearn);
router.delete('/userLearn/deleteOne/:id', UserLearnmoreController.deleteSingle);
router.get('/userLearn/learnbyId/:id', UserLearnmoreController.getLearnUserById );

module.exports = router;
