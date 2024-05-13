const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const {deleteActorById,
    addActor,
    getMoviesByActorName} = require('../controllers/actorController');


router.post('/actors/:id/delete',deleteActorById);
router.post('/actors', addActor);
router.get('/actor/:name', getMoviesByActorName);



module.exports = router;



