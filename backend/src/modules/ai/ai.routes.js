const authMiddleware = require('../../middlewares/auth.middleware');
const router = require('express').Router();
const controller =require('./ai.controller');

router.post('/generate', authMiddleware,controller.generate);

module.exports= router;