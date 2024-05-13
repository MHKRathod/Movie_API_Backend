const Movie = require('./movie.model');
const Genre = require('./genre.model');

Movie.belongsToMany(Genre, { 
  through: 'MovieGenre',
  timestamps: false // Disable timestamps for the join table
});