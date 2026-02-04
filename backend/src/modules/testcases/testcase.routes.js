const router =require('express').Router();
const controller =require('./testcase.controller');
const auth =require('../../middlewares/auth.middleware');

router.get('/', auth, controller.listByProject);

module.exports = router;
