const router = require('express').Router();
const { model } = require('mongoose');
const controller =require('./auth.controller');

router.post('/signup', controller.register); 
router.post('/login', controller.login);

module.exports = router;