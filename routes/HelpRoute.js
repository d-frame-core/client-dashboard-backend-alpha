const express = require('express');
const router = express.Router();
const HelpController = require('../controllers/HelpController');
const UserHelpController = require('../controllers/UserHelpController');

router.get('/readAllHelp',  HelpController.getAllhelp);
router.get('/helpby/:id', HelpController.gethelpById );

//for admin
router.post('/admin/addHelp',  HelpController.createHelp);
router.post('/admin/addsingleHelp',  HelpController.createSingleHelp);
router.put('/admin/update/:id',HelpController.updateHelp);
router.delete('/admin/delete', HelpController.delete);
router.delete('/admin/deleteSingle/:id', HelpController.deleteSingle);


//user Routes
router.get('/userHelp/getAllHelp',  UserHelpController.getAllhelp);
router.post('/userHelp/addAllHelp',  UserHelpController.createHelp);
router.put('/userHelp/update/:id',UserHelpController.updateHelp);
router.delete('/userHelp/deleteAll', UserHelpController.delete);
router.get('/userHelp/helpby/:id', UserHelpController.gethelpById );

module.exports = router;
