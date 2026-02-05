const router = require('express').Router();
const controller = require('./testcase.controller');
const auth = require('../../middlewares/auth.middleware');


router.get('/project/:projectId', auth, controller.getProjectSuites);


router.get('/', auth, controller.listByProject);

router.delete('/:id', auth, controller.deleteTestCase);

module.exports = router;
// const router =require('express').Router();
// const controller =require('./testcase.controller');
// const auth =require('../../middlewares/auth.middleware');

// router.get('/', auth, controller.listByProject);

// module.exports = router;
