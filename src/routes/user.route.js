'use strict';
const express = require('express');
const router = express.Router();
const  userCtrl = require('../ctrls/user.ctrl')

router.post('/signup',userCtrl.signup);
router.post('/login',userCtrl.login);


module.exports = router;
