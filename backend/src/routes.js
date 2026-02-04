const router =require('express').Router();
router.use('/ai' ,require('./modules/ai/ai.routes'));
router.use('/auth', require('./modules/auth/auth.routes'));
router.use('/testcases', require('./modules/testcases/testcase.routes'));
router.use('/testruns', require('./modules/testruns/testrun.routes'));
router.use('/dashboard' ,require('./modules/dashboard/dashboard.routes'));

router.use('/projects', require('./modules/project/project.routes'));



module.exports = router;