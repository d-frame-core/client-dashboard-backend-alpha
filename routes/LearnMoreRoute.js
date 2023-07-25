const express = require('express');
const router = express.Router();
const LearnMoreController = require('../controllers/LearnmoreController');
const UserLearnmoreController = require('../controllers/UserLearnmoreController');


router.get('/readLearnMore/',  LearnMoreController.getAllLearnMore);
router.post('/addLearnMore/', LearnMoreController.createLearnMore);
router.get('/learnMore/:id', LearnMoreController.getLearnMoreById);
//for admin
router.put('/admin/update/:id', LearnMoreController.updateLearnMore );
router.delete('/admin/delete', LearnMoreController.delete);
router.delete('/admin/deleteSingle/:id', LearnMoreController.deleteSingle);


//user Routes
router.get('/userLearn/getAllLearn',  UserLearnmoreController.getAllLearnUser);
router.post('/userLearn/addAllLearn',  UserLearnmoreController.createLearnUser);
router.put('/userLearn/update/:id',UserLearnmoreController.updateLearnUser);
router.delete('/userLearn/deleteAll', UserLearnmoreController.deleteLearn);
router.get('/userLearn/learnbyId/:id', UserLearnmoreController.getLearnUserById );

module.exports = router;