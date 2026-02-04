const router =require('express').Router();
const controller= require('./testrun.controller');
const auth =require('../../middlewares/auth.middleware');

router.post('/:id/rerun', auth, controller.rerun);

router.get('/:id', auth, controller.getRunById);
router.post('/:id/rerun-failed', auth, controller.rerunFailedTests);

router.get(
  '/project/:projectId',
  auth,
  controller.getRunsByProject
);


module.exports =router;