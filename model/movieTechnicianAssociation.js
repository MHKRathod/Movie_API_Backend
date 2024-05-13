const Movie = require('./movie.model');
const Technician = require('./technician.model');

Movie.belongsToMany(Technician, { through: 'MovieTechnician', timestamps: false });
