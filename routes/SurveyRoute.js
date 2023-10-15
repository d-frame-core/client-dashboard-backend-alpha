const express = require('express');
const path = require('path'); // Import the path module
const router = express.Router();

// Convert the relative paths to absolute paths
const SurveyController = require(path.join(__dirname, '..', 'controllers', 'SurveyController'));
const checkToken = require(path.join(__dirname, '..', 'middleware', 'auth'));

// Create a new survey
router.post('/addSurvey', SurveyController.createSurvey);

// Get a list of all surveys
router.get('/getAll', SurveyController.getSurveys);

// Get all surveys created by a specific client
router.get('/client/:id',  SurveyController.getSurveysByclient);

// Get a single survey by ID
router.get('/singleSurvey/:surveyId', SurveyController.findOne);

// Update a survey by ID
router.put('/updateSurvey/:surveyId',  SurveyController.update);

// Delete a survey by ID
router.delete('/deleteSurvey/:surveyId', SurveyController.delete);

// delete all survey
router.delete('/deleteAll', SurveyController.deleteAllSurveys);

//delete particular client survey
router.delete('/client/removeS',  SurveyController.deleteSurvey );

// Get expired surveys
router.get('/expired/data', SurveyController.getExpiredSurveys);

//Get expired survey by Id
router.get("/expired/:id", SurveyController.getExpiredSurveyById);

//Get expierdsurveys of a particular client
router.get('/expired/client/c', SurveyController.getExpiredSurveysByclientid);


//delete expired survey of particular client

router.delete("/expired/removeS", SurveyController.deleteExpiredSurveys);

// Get analysis of the most chosen answer for each question
router.get('/:surveyId/analysis', SurveyController.getSurveyAnalysis);

//active and inactive the survey mainly for admin
router.put('/:id/status', SurveyController.updateStatusSurvey);

router.put('/verifyStatus/:id', SurveyController.verifyStatus);
router.put('/stopStatus/:id', SurveyController.stopStatus);
router.put('/expiredStatus/:id', SurveyController.expireStatus);
module.exports = router;

