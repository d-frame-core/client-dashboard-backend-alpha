const express = require('express');
const router = express.Router();
const SurveyController = require('../controllers/SurveyController');
const checkToken = require('../middleware/auth');

// Create a new survey
router.post('/', SurveyController.createSurvey);

// Get a list of all surveys
router.get('/', SurveyController.getSurveys);

// Get all surveys created by a specific client
router.get('/client/',checkToken,  SurveyController.getSurveysByclient);

// Get a single survey by ID
router.get('/:surveyId', SurveyController.findOne);

// Update a survey by ID
router.put('/:surveyId',  SurveyController.update);

// Delete a survey by ID
router.delete('/:surveyId', SurveyController.delete);

// delete all survey
router.delete('/', SurveyController.deleteAllSurveys);

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

module.exports = router;

