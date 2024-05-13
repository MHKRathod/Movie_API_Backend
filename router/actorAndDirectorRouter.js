const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const {getActorDirectorHandler} = require('../controllers/actorAndDirectorController');


router.get('/movies/director/:directorName/actor/:actorName', getActorDirectorHandler);


module.exports = router;