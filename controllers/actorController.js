// actorsController.js

const Actor = require('../model/actor.model');
const Movie = require('../model/movie.model');

// Controller to delete an actor by ID if not associated with any movies
const deleteActorById = async (req, res) => {
    const actorId = req.params.id;

    try {
        const actor = await Actor.findByPk(actorId);
        if (!actor) {
            return res.status(404).json({ error: 'Actor not found.' });
        }

        const moviesCount = await Movie.count({ include: [{ model: Actor, where: { id: actorId } }] });
        if (moviesCount > 0) {
            return res.status(400).json({ error: 'Actor is associated with movies. Cannot delete.' });
        }

        await actor.destroy();
        res.json({ message: 'Actor deleted successfully.' });
    } catch (error) {
        console.error('Error deleting actor:', error);
        res.status(500).json({ error: 'Error deleting actor', details: error.message });
    }
};

// Controller to add a new actor
const addActor = async (req, res) => {
    const { name } = req.body; 

    try {
        const actor = await Actor.create({ name });
        res.status(201).json({ actor });
    } catch (error) {
        console.error('Error adding actor:', error);
        res.status(500).json({ error: 'Error adding actor', details: error.message });
    }
};

// Controller to get movies by actor name
const getMoviesByActorName = async (req, res) => {
    const { name } = req.params;

    try {
        const actor = await Actor.findOne({ where: { name } });
        if (!actor) return res.status(404).json({ error: 'Actor not found' });

        const movies = await Movie.findAll({
            attributes: ['id', 'title', 'releaseYear', 'ratings', 'director'],
            include: [{
                model: Actor,
                where: { id: actor.id },
                through: { attributes: [] }
            }],
            raw: true
        });

        res.json(movies);
    } catch (error) {
        console.error('Error fetching movies by actor:', error);
        res.status(500).json({ error: 'Error fetching movies by actor', details: error.message });
    }
};

module.exports = {
    deleteActorById,
    addActor,
    getMoviesByActorName
};
