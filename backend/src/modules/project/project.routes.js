const router = require('express').Router();
const controller =require('./project.controller');
const auth =require('../../middlewares/auth.middleware');
const runController= require('../testruns/testrun.controller');


router.post('/:id/run', auth, runController.executeSuite);
router.get('/:id/runs',auth,runController.getRunsByProject)
router.post('/',auth, controller.create);
router.get('/',auth, controller.list);
router.get('/:id', auth, controller.getOne);
router.delete('/:id',auth, controller.remove);


module.exports =router;