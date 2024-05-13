const { Op } = require('sequelize');
const Movie = require('../model/movie.model');
const Actor = require('../model/actor.model');

// Handler for GET /movies/director/:directorName/actor/:actorName
const getActorDirectorHandler = async(req, res) => {
    const { directorName, actorName } = req.params;

    try {
        const directorNames = directorName.split(',').map(name => name.trim());
        const actorNameTrimmed = actorName.trim();

        const movies = await Movie.findAll({
            attributes: ['id', 'title', 'releaseYear', 'ratings', 'director'],
            include: [{
                model: Actor,
                where: { name: actorNameTrimmed },
                attributes: ['name'],
                through: { attributes: [] }
            }],
            where: {
                [Op.or]: directorNames.map(name => ({ director: { [Op.like]: `%${name}%` } }))
            },
            raw: true
        });

        if (movies.length === 0) {
            return res.status(404).json({ error: 'No movies found for the given director and actor' });
        }

        res.json(movies);
    } catch (error) {
        console.error('Error fetching movies by director and actor:', error);
        res.status(500).json({ error: 'Error fetching movies by director and actor', details: error.message });
    }
}

module.exports = {getActorDirectorHandler};
