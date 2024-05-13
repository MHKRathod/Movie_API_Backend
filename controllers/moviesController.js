// movieController.js

const { Op } = require('sequelize');
const Movie = require('../model/movie.model');
const Genre = require('../model/genre.model');
const Actor = require('../model/actor.model');
const Technician = require('../model/technician.model');


const addMovie = async (req, res) => {
    const { title, releaseYear, ratings, director, genres, actors, technicians } = req.body;

    try {
        // Check if the movie already exists based on title and release year
        const existingMovie = await Movie.findOne({ where: { title, releaseYear } });
        if (existingMovie) {
            return res.status(400).json({ error: 'Movie already exists' });
        }

        // Create the movie record
        const movie = await Movie.create({ title, releaseYear, ratings, director });

        // Create or find existing records for genres, actors, and technicians
        const createdGenres = await Promise.all(genres.map(genreData => Genre.findOrCreate({ where: genreData })));
        const createdActors = await Promise.all(actors.map(actorData => Actor.findOrCreate({ where: actorData })));
        const createdTechnicians = await Promise.all(technicians.map(technicianData => Technician.findOrCreate({ where: technicianData })));

        // Associate the movie record with the corresponding genre, actor, and technician records
        await movie.addGenres(createdGenres.map(([genre]) => genre));
        await movie.addActors(createdActors.map(([actor]) => actor));
        await movie.addTechnicians(createdTechnicians.map(([technician]) => technician));

        res.status(201).json(movie); // Respond with the created movie
    } catch (error) {
        console.error('Error adding movie:', error);
        res.status(500).json({ error: 'Error adding movie', details: error.message });
    }
};

const getMovies = async (req, res) => {
    const { actorId, directorId, technicianId } = req.query;
    const where = {};
    if (actorId) where.actorId = actorId;
    if (directorId) where.directorId = directorId;
    if (technicianId) where.technicianId = technicianId;

    try {
        const movies = await Movie.findAll({
            attributes: ['id', 'title', 'releaseYear', 'ratings','director'],
            include: [
                { model: Genre, attributes: ['name'] },
                { model: Actor, attributes: ['name'] },
                { model: Technician, attributes: ['name'] }
            ],
            where
        });
        
        // Customize the response to remove unnecessary IDs and intermediary tables
        const formattedMovies = movies.map(movie => ({
            id: movie.id,
            title: movie.title,
            releaseYear: movie.releaseYear,
            ratings: movie.ratings,
            director: movie.director,
            genres: movie.Genres.map(genre => genre.name),
            actors: movie.Actors.map(actor => actor.name),
            technicians: movie.Technicians.map(technician => technician.name)
        }));
        
        res.json(formattedMovies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Error fetching movies', details: error.message });
    }
};

// Controller to fetch a particular movie by title
const getMovieByTitle = async (req, res) => {
    const { title } = req.params;
    try {
        const movie = await Movie.findOne({
            attributes: ['id', 'title', 'releaseYear', 'ratings'],
            where: { title },
            include: [
                { model: Genre, attributes: ['name'] },
                { model: Actor, attributes: ['name'] },
                { model: Technician, attributes: ['name'] }
            ]
        });
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        // Customize the response to remove unnecessary IDs
        const formattedMovie = {
            id: movie.id,
            title: movie.title,
            releaseYear: movie.releaseYear,
            ratings: movie.ratings,
            genres: movie.Genres.map(genre => ({ name: genre.name })),
            actors: movie.Actors.map(actor => ({ name: actor.name })),
            technicians: movie.Technicians.map(technician => ({ name: technician.name }))
        };
        res.json(formattedMovie);
    } catch (error) {
        console.error('Error fetching movie:', error);
        res.status(500).json({ error: 'Error fetching movie', details: error.message });
    }
};

// Controller to update a movie by title
const updateMovieByTitle = async (req, res) => {
    const { releaseYear, ratings, genres, actors, technicians } = req.body;
    const title = req.params.title;

    try {
        const movie = await Movie.findOne({ where: { title } });
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        // Create or find genres, actors, and technicians
        const [genreIds, actorIds, technicianIds] = await Promise.all([
            createOrFindEntities(genres, Genre),
            createOrFindEntities(actors, Actor),
            createOrFindEntities(technicians, Technician)
        ]);

        // Update movie attributes
        await movie.update({ releaseYear, ratings });

        // Set associations
        await movie.setGenres(genreIds);
        await movie.setActors(actorIds);
        await movie.setTechnicians(technicianIds);

        res.json({ message: 'Movie updated successfully' });
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).json({ error: 'Error updating movie', details: error.message });
    }
};

// Controller to delete a movie by title
const deleteMovieByTitle = async (req, res) => {
    try {
        const movie = await Movie.findOne({ where: { title: req.params.title } });
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        await movie.destroy();
        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({ error: 'Error deleting movie', details: error.message });
    }
};

// Helper function to create or find entities
async function createOrFindEntities(entities, Model) {
    const entityIds = await Promise.all(entities.map(async (entity) => {
        const [createdEntity] = await Model.findOrCreate({ where: entity });
        return createdEntity.id;
    }));
    return entityIds;
}

const getMovieByDirectorNAme = async (req, res) => {
    const { name } = req.params;
    try {
        // Step 1: Find the movies directed by the director
        const movies = await Movie.findAll({
            where: { director: { [Op.like]: `%${name}%` } },
            include: [
                { model: Genre, attributes: ['name'], through: { attributes: [] } },
                { model: Actor, attributes: ['name'], through: { attributes: [] } },
                { model: Technician, attributes: ['name'], through: { attributes: [] } }
            ]
        });

        res.json(movies);
    } catch (error) {
        console.error('Error fetching movies by director:', error);
        res.status(500).json({ error: 'Error fetching movies by director', details: error.message });
    }
}
module.exports = {
    addMovie,
    getMovies,
    getMovieByTitle,
    updateMovieByTitle,
    deleteMovieByTitle,
    getMovieByDirectorNAme
};
