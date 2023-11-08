'use strict';
const express = require('express');
const router = express.Router();
const  movieCtrl = require('../ctrls/movie.ctrl')
const {auth} = require('../middlewares/authMiddleware')

router.get('/',movieCtrl.all);
router.post('/',auth,movieCtrl.create);
router.get('/:id',movieCtrl.view);
router.put('/:id',auth,movieCtrl.update);
router.delete('/:id',auth,movieCtrl.destroy);

module.exports = router;
