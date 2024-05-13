const Movie = require('./movie.model');
const Actor = require('./actor.model');

Movie.belongsToMany(Actor, { through: 'MovieActor', timestamps: false, });
