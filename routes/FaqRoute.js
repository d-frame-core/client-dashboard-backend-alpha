const express = require('express');
const router = express.Router();
const FaqController = require('../controllers/FaqController');
const UserFaqController = require('../controllers/UserFaqController');

// Create a new FAQ
router.post('/addFaq', FaqController.createFAQ);
router.post('/addSingleFaq', FaqController.createSingleFAQ);
// Get all FAQs
router.get('/faq', FaqController.getAllFAQs);
// Get a specific FAQ by ID
router.get('/faq/:id', FaqController.getFAQById);
//all admin 
router.put('/admin/updateFaq/:id', FaqController.updateFAQById); 
router.delete('/admin/deleteFaq/:id', FaqController.deleteSingleFaq);



//user Routes
router.get('/userFAQ/getAllFAQ',  UserFaqController.getAllFAQUsers);
router.post('/userFAQ/addAllFAQ',  UserFaqController.createFAQUser);
router.post('/userFAQ/addFAQ',  UserFaqController.createSingleFAQUser);
router.put('/userFAQ/update/:id',UserFaqController.updateFAQUserById);
router.delete('/userFAQ/deleteSingle/:id', UserFaqController.deleteSingleFAQUser);
router.get('/userFAQ/FAQby/:id', UserFaqController.getFAQUserById );

module.exports = router;