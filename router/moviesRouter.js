const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Movie = require('../model/movie.model');
const Genre = require('../model/genre.model');
const Actor = require('../model/actor.model');
const Technician = require('../model/technician.model');

const {addMovie,
    getMovies,
    getMovieByTitle,
    updateMovieByTitle,
    deleteMovieByTitle,
    getMovieByDirectorNAme
} = require('../controllers/moviesController');

// GET route to fetch a particular movie by ID
router.get('/movies/:title', getMovieByTitle);

// POST route to add a new movie
router.post('/movies', addMovie);

// PUT route to update a movie by ID
router.put('/movies/:title', updateMovieByTitle);

// DELETE route to delete a movie by ID
router.delete('/movies/:title', deleteMovieByTitle);

// GET route to fetch all movies with pagination and filters
router.get('/movies', getMovies);

///director name api get
router.get('/movies/director/:name',getMovieByDirectorNAme);


module.exports = router;













































