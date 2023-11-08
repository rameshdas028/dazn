'use strict';
const express = require('express');
const router = express.Router();
const movieRoute = require('./movie.route');
const userRoute = require('./user.route');
const movieCtrl = require('../ctrls/movie.ctrl');


router.use('/movie',movieRoute);
router.use('/user',userRoute);
router.get('/search',movieCtrl.search);
module.exports = router;
