const express  = require('express');
// const router =require('express').Router;
const router = express.Router();
const auth = require('../../middlewares/auth.middleware')
// const auth = require('../auth/auth.controller')

const{getSummary,getRecentRuns} =require('./dashboard.controller');

router.get('/summary',auth,getSummary);
router.get('/recent',auth,getRecentRuns);

module.exports =router;